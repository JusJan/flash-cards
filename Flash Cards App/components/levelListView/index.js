'use strict';

app.levelListView = kendo.observable({
    onShow: function () {
        if (!app.user) {
            app.mobileApp.navigate("components/authenticationView/view.html");
        } else {
         //   app.levelListView.levelListViewModel.dataSource.read();
        }
    },
    afterShow: function () {}
});

// START_CUSTOM_CODE_levelListView
// END_CUSTOM_CODE_levelListView
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
                        'Level': {
                            field: 'Level',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions);
    dataSource.group({
        field: "Level"
    });
    dataSource.fetch(function () {        
        var view = dataSource.view();
        var newData = new kendo.data.DataSource();
        for (var i=0; i<view.length; i++) {
            newData.add(view[i]);
        }
       // console.log(newData);
        var levelListViewModel = kendo.observable({
            dataSource: newData,
            itemClick: function (e) {
               
               app.mobileApp.navigate('#components/levelCardsListView/view.html?value='+e.dataItem.value);
            },
            detailsShow: function (e) {
                var group = e.view.params.value,
                    dataSource = levelListViewModel.get('dataSource'),
                    levelModel = dataSource[group];
                if (!levelModel.value) {
                    levelModel.value = String.fromCharCode(160);
                }
                levelListViewModel.set('currentItem', levelModel);
            },
            currentItem: null
        });

        parent.set('levelListViewModel', levelListViewModel);
    });
})(app.levelListView);

// START_CUSTOM_CODE_levelListViewModel
// END_CUSTOM_CODE_levelListViewModel