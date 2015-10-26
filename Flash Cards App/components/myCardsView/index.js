'use strict';

app.myCardsView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_myCardsView
// END_CUSTOM_CODE_myCardsView
(function(parent) {
    var dataProvider = app.data.flashCardsBackend,
        flattenLocationProperties = function(dataItem) {
            var propName, propValue,
                isLocation = function(value) {
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
                dataProvider: dataProvider
            },

            change: function(e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    flattenLocationProperties(dataItem);
                }
            },
            schema: {
                model: {
                    fields: {
                        'Text': {
                            field: 'Text',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        myCardsViewModel = kendo.observable({
            dataSource: dataSource
        });

    parent.set('myCardsViewModel', myCardsViewModel);
})(app.myCardsView);

// START_CUSTOM_CODE_myCardsViewModel
// END_CUSTOM_CODE_myCardsViewModel