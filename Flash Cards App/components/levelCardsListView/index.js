'use strict';

app.levelCardsListView = kendo.observable({

    onShow: function (e) {
        var viewLevel = e.view.params.value;
        var filterOptions = {
            field: 'Level',
            operator: 'equal',
            value: parseInt(viewLevel),
        };
        app.levelCardsListView.levelCardsListViewModel.dataSource.filter(filterOptions);
        app.levelCardsListView.levelCardsListViewModel.dataSource.read();


    },
    afterShow: function () {
       
    }
});

// START_CUSTOM_CODE_levelCardsListView

// END_CUSTOM_CODE_levelCardsListView
(function (parent) {
    var dataProvider = app.data.flashCardsBackend,
        flattenLocationProperties = function (dataItem) {
            var propName, propValue,
                isLocation = function (value) {
                    return propValue && typeof propValue === 'object' &&
                        propValue.longitude && propValue.latitude;
                };

            for (propName in dataItem) {
                if (dataItem.hasOwnProperty(propName)) {
                    propValue = dataItem[propName];
                    if (isLocation(propValue)) {
                        // Location type property
                        dataItem[propName] =
                            kendo.format('Latitude: {0}, Longitude: {1}',
                                propValue.latitude, propValue.longitude);
                    }
                }
            }
        },
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'UsersWords',
                dataProvider: dataProvider,

            },
            change: function (e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    flattenLocationProperties(dataItem);
                }
            },
            schema: {
                model: {
                    //    id: 'Id',
                    fields: {
                        'Id': {
                            field: 'Id'
                        },
                        'Word': {
                            field: 'Word',
                        },
                        'Translation': {
                            field: 'Translation',
                        },
                        'Level': {
                            field: 'Level',
                            type: 'number',
                            defaultvalue: 1
                        },
                        'CorrectAnswers': {
                            field: 'CorrectAnswers',
                            type: 'number',
                            defaultvalue: 0
                        },
                        'IncorrectAnswers': {
                            field: 'IncorrectAnswers',
                            type: 'number',
                            defaultvalue: 0
                        }
                    }

                }

            },
        },

        dataSource = new kendo.data.DataSource(dataSourceOptions);

    var levelCardsListViewModel = kendo.observable({
        dataSource: dataSource,
        startLearning: function () {
            if (levelCardsListViewModel.dataSource.view().length == 0) {
                alert('There is no cards!');
            } else {
                levelCardsListViewModel.set('handCards', levelCardsListViewModel.dataSource.view());
                var firstCardId = levelCardsListViewModel.handCards[0].id;
                levelCardsListViewModel.set('currentItemIndex', 1);
                levelCardsListViewModel.set('dataLength', levelCardsListViewModel.handCards.length);
                app.mobileApp.navigate('#components/levelCardsListView/details.html?id=' + firstCardId);
            }
        },
        cancelLearning: function () {
            app.mobileApp.navigate('#components/levelCardsListView/view.html?value=' + dataSource.view()[0].Level);
        },
        itemClick: function (e) {
            app.mobileApp.navigate('#components/levelCardsListView/details.html?id=' + e.dataItem.id);
        },
        detailsShow: function (e) {
            var item = e.view.params.id,
                dataSource = levelCardsListViewModel.get('dataSource'),
                itemModel = dataSource.get(item);
            if (!itemModel.Word) {
                itemModel.Word = String.fromCharCode(160);
            }
            levelCardsListViewModel.set('currentItem', itemModel);
            // after 3s show answer

            var start = new Date();
            var maxTime = app.settingsView.settingsViewModel.fields.showCard * 1000;
            var timeoutVal = Math.floor(maxTime / 100);
            animateUpdate();

            function updateProgress(percentage) {
                $('#pbar_innerdiv').css("width", percentage + "%");

            }

            function animateUpdate() {
                var now = new Date();
                var timeDiff = now.getTime() - start.getTime();
                var perc = Math.round((timeDiff / maxTime) * 100);
                if (perc <= 100) {
                    updateProgress(perc);
                    levelCardsListViewModel.set('timer2', window.setTimeout(animateUpdate, timeoutVal));
                }
            }



            $("#wordTranslation").hide();
            levelCardsListViewModel.set('timer', window.setTimeout(levelCardsListViewModel.displayTranslation, maxTime));

        },
        correct: function (e) {
            // update level and correctanswers
            var selectedItem = e.data.currentItem.id;
            var dataSource = levelCardsListViewModel.get('dataSource');
            var item = dataSource.get(selectedItem);
            var currentLevel = item.Level;
            var ca = parseInt(item.CorrectAnswers) + 1;
            if (parseInt(item.Level) != 5) {
                var level = parseInt(item.Level) + 1;
            }
            item.set('CorrectAnswers', ca);
            item.set('Level', level);
            dataSource.sync();
            // redirect to next word or level list
            levelCardsListViewModel.nextCard(currentLevel);
        },
        incorrect: function (e) {
            // update level and incorrectanswers
            var selectedItem = e.data.currentItem.id;
            var dataSource = levelCardsListViewModel.get('dataSource');
            var item = dataSource.get(selectedItem);
            var currentLevel = item.Level;
            var ia = parseInt(item.IncorrectAnswers) + 1;
            var level = 1;
            item.set('IncorrectAnswers', ia);
            item.set('Level', level);
            dataSource.sync();
            // redirect ti next word or level
            levelCardsListViewModel.nextCard(currentLevel);

        },
        nextCard: function (level) {
            if (levelCardsListViewModel.currentItemIndex == levelCardsListViewModel.dataLength) {
                app.mobileApp.navigate('#components/levelCardsListView/view.html?value=' + level);
            } else {
      
      
                var nextCardId = levelCardsListViewModel.handCards[levelCardsListViewModel.currentItemIndex].id;

                levelCardsListViewModel.set('currentItemIndex', levelCardsListViewModel.currentItemIndex + 1);
                
                window.clearTimeout(levelCardsListViewModel.timer);
                window.clearTimeout(levelCardsListViewModel.timer2);
                $('#pbar_innerdiv').css("width", "0%");
                app.mobileApp.navigate('#components/levelCardsListView/details.html?id=' + nextCardId);
            }
        },
        deleteCard: function (e) {
            var selectedItem = e.data.uid;
            var dataSource = levelCardsListViewModel.get('dataSource');
            var item = dataSource.getByUid(selectedItem);
            
            
            var deleteItem = dataSource.at(0);
            //deleteItem.set({'Level': 2});
            dataSource.remove(item);
            

          //  dataSource.sync();

            // });


        },
        currentItem: null,
        currentItemIndex: null,
        dataLength: null,
        handCards: null,
        displayTranslation: function () {
            $('#wordTranslation').show();
            //window.setTimeout(levelCardsListViewModel.incorrect, 3000);
        },
        timer: null,
        timer2: null
    });


    parent.set('levelCardsListViewModel', levelCardsListViewModel);
})(app.levelCardsListView);

// START_CUSTOM_CODE_levelCardsListViewModel
// END_CUSTOM_CODE_levelCardsListViewModel