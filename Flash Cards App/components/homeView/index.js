'use strict';

app.homeView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_homeView
// END_CUSTOM_CODE_homeView
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
                typeName: 'Words',
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
                        'Word': {
                            field: 'Word',
                            defaultValue: ''
                        },
                        'Translation': {
                            field: 'Translation',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        homeViewModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function(e) {
                app.mobileApp.navigate('#components/homeView/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = homeViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.Word) {
                    itemModel.Word = String.fromCharCode(160);
                }
                homeViewModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    parent.set('homeViewModel', homeViewModel);
})(app.homeView);

// START_CUSTOM_CODE_homeViewModel
// END_CUSTOM_CODE_homeViewModel