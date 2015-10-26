'use strict';

app.levelCardsListView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_levelCardsListView
// END_CUSTOM_CODE_levelCardsListView
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
                        'Word': {
                            field: 'Word',
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
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        levelCardsListViewModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function(e) {
                app.mobileApp.navigate('#components/levelCardsListView/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = levelCardsListViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.Word) {
                    itemModel.Word = String.fromCharCode(160);
                }
                levelCardsListViewModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    parent.set('levelCardsListViewModel', levelCardsListViewModel);
})(app.levelCardsListView);

// START_CUSTOM_CODE_levelCardsListViewModel
// END_CUSTOM_CODE_levelCardsListViewModel