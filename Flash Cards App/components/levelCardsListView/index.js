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


    },
    afterShow: function () {}
});

// START_CUSTOM_CODE_levelCardsListView
function Correct(e) {
        // console.log(e.button.data().id);
        app.mobileApp.navigate('#components/levelCardsListView/details.html?id=' + e.button.data().id);
    }
    // END_CUSTOM_CODE_levelCardsListView
    (function (parent) {
        var expandExpr = {
            'Word': {
                TargetTypeName: 'Words',
            },
        };
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
                    read: {
                        contentType: "application/json",
                        headers: {
                            "X-Everlive-Expand": JSON.stringify(expandExpr)
                        }
                    },

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
                        fields: {
                            'WordName': {
                                field: 'Word.Word',
                                defaultValue: ''
                            },
                            'Level': {
                                field: 'Level',
                                defaultValue: ''
                            },
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
                    var firstCardId = levelCardsListViewModel.dataSource.view()[0].id;
                    levelCardsListViewModel.set('currentItemIndex', 1);
                    levelCardsListViewModel.set('dataLength', levelCardsListViewModel.dataSource.view().length);
                    app.mobileApp.navigate('#components/levelCardsListView/details.html?id=' + firstCardId);
                }
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

            },
            correct: function (e) {
                // update level and correctanswers

                // redirect to next word or level list
                levelCardsListViewModel.nextCard();
            },
            incorrect: function () {
                // 
            },
            nextCard: function() {
               if (levelCardsListViewModel.currentItemIndex == levelCardsListViewModel.dataLength) {
                    app.mobileApp.navigate('#components/levelCardsListView/view.html?value=' + dataSource.view()[0].Level);
                } else {
                    var nextCardId = levelCardsListViewModel.dataSource.view()[levelCardsListViewModel.currentItemIndex].id;
                    levelCardsListViewModel.set('currentItemIndex', levelCardsListViewModel.currentItemIndex + 1);
                    app.mobileApp.navigate('#components/levelCardsListView/details.html?id=' + nextCardId);
                } 
            },
            currentItem: null,
            currentItemIndex: null,
            dataLength: null,
        });

        parent.set('levelCardsListViewModel', levelCardsListViewModel);
    })(app.levelCardsListView);

// START_CUSTOM_CODE_levelCardsListViewModel
// END_CUSTOM_CODE_levelCardsListViewModel