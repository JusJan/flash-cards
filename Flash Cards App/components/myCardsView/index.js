'use strict';

app.myCardsView = kendo.observable({
    onShow: function () {
        if (!app.user) {
            app.mobileApp.navigate("components/authenticationView/view.html");
        } else {
            app.myCardsView.myCardsViewModel.dataSource.read();
        }

    },
    afterShow: function () {}
});

// START_CUSTOM_CODE_myCardsView
// END_CUSTOM_CODE_myCardsView
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
                //    expand: {'Words': 'Word'}, 
                dataProvider: dataProvider,
                read: {
                    contentType: "application/json",
                    headers: {
                        "X-Everlive-Expand": JSON.stringify(expandExpr)
                    }
                },
            },
             schema: {
                model: {
                    id: 'Id',
                //    children: 'Word',
                    fields: {
                        'WordName': {
                //            TargetTypeName: 'Words',
                            field: 'Word.Word',
                        },
                        'WordTranslation':{
              //              TargetTypeName: 'Words',
                            field:'Word.Translation',
                        },
                        'Level': {
                            field: 'Level',
                            defaultValue: '',
                        },
                        'Owner': {
                            field: 'Owner',
                            //  validation:{is: app.user.Id},
                        },
                    }
                }
            },

            change: function (e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    flattenLocationProperties(dataItem);
                }
            },
            // filter: { field: 'Owner', operator: 'contains', value: app.user.Id },
           
        },
        dataSource = new kendo.data.HierarchicalDataSource(dataSourceOptions),
        myCardsViewModel = kendo.observable({
            dataSource: dataSource
        });
    console.log(dataSource);
    parent.set('myCardsViewModel', myCardsViewModel);
})(app.myCardsView);

// START_CUSTOM_CODE_myCardsViewModel
// END_CUSTOM_CODE_myCardsViewModel