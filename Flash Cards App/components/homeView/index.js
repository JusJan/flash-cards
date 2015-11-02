'use strict';

app.homeView = kendo.observable({
    onShow: function () {
        app.homeView.homeViewModel.dataSource.read();
    },
    afterShow: function () {}
});

// START_CUSTOM_CODE_homeView

// END_CUSTOM_CODE_homeView
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
                typeName: 'Words',
                dataProvider: dataProvider
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
                        'Word': {
                            field: 'Word',
                            defaultValue: ''
                        },
                        'Translation': {
                            field: 'Translation',
                            defaultValue: ''
                        },
                        'Id': {
                            field: 'Id',
                            defaultValue: 0
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        homeViewModel = kendo.observable({
            dataSource: dataSource,
            add: function () {
                if (!this.word || !this.translation) {
                    alert("Please fill all inputs.");
                    return;
                }
                var data = dataSource.data();
                var thisWord = this.word;
                var res = $.grep(data, function (d) {
                    return d.Word == thisWord;
                });
                if (!res) {
                    dataSource.add({
                        Word: this.word,
                        Translation: this.translation
                    });
                    dataSource.one("sync", homeViewModel.close());
                    dataSource.sync();
                } else {
                    alert("This word already exist");
                }




            },
            close: function () {

                $("#add").data("kendoMobileModalView").close();
                this.word = "";
                this.translation = "";
            }

        });
    // console.log(dataSource);
    parent.set('homeViewModel', homeViewModel);

})(app.homeView);

// START_CUSTOM_CODE_homeViewModel
function AddToMyCards(e) {
        if (!app.user) {
            app.mobileApp.navigate("components/authenticationView/view.html");
        } else {
            var word = e.button.data().word;
            var translation = e.button.data().translation;
            var userId = app.user.Id;
            //add word to user's cards
            var dataProvider = app.data.flashCardsBackend,
                usersWordsDataOptions = {
                    type: 'everlive',
                    transport: {
                        typeName: 'UsersWords',
                        dataProvider: dataProvider
                    },
                    schema: {
                        model: {

                            fields: {
                                'Word': {
                                    field: 'Word',
                                    defaultValue: ''
                                },

                                'Level': {
                                    field: 'Level',
                                    defaultValue: 1
                                },
                                'IncorrectAnswers': {
                                    field: 'IncorrectAnswers',
                                    defaultValue: 0
                                },
                                'CorrectAnswers': {
                                    field: 'CorrectAnswers',
                                    defaultValue: 0
                                },
                            }
                        }
                    },
                },
                dataUsersWords = new kendo.data.DataSource(usersWordsDataOptions);
            dataUsersWords.filter([
                {
                    field: 'Word',
                    operator: 'equal',
                    value: word,
                },
                {
                    field: 'Owner',
                    operator: 'equal',
                    value: userId
                }
            ]);
            //dataUsersWords.read();
            dataUsersWords.fetch(function () {

                if (dataUsersWords.total() == 0) {
                    dataUsersWords.add({
                        Word: word,
                        Translation: translation,
                        Level: "1",
                        IncorrectAnswers: "0",
                        CorrectAnswers: "0"
                    });
                    dataUsersWords.sync();
                } else {
                    window.alert('You already have this card!');

                }
            });




        }
    }
    // END_CUSTOM_CODE_homeViewModel