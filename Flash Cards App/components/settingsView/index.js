'use strict';

app.settingsView = kendo.observable({
    onShow: function () {
        if (!app.user) {
            app.mobileApp.navigate("components/authenticationView/view.html");
        } 
        else {
            defaultSettings();
        }
    },
    afterShow: function () {}
});
function defaultSettings() {
     var dataSource = app.settingsView.settingsViewModel.dataSource;
            var filterOptions =  {field: 'Owner',
            operator: 'equal',
            value: app.user.id};
            dataSource.filter(filterOptions);
            dataSource.read();
            dataSource.fetch(function () {
                if(!dataSource.at(0)) {
                    dataSource.add({'ShowCard': 3});
                    dataSource.sync();
                    app.settingsView.settingsViewModel.set('fields.showCard', dataSource.at(0).ShowCard);
                }
                else {
                    app.settingsView.settingsViewModel.set('fields.showCard', dataSource.at(0).ShowCard);
                }
            });
}
// START_CUSTOM_CODE_settingsView
// END_CUSTOM_CODE_settingsView
(function (parent) {
    console.log(app.user);
    var dataProvider = app.data.flashCardsBackend;
    var dataSourceOptions = {
        type: 'everlive',
        transport: {
            typeName: 'Settings',
            dataProvider: dataProvider,
        },
        scheme: {
            model: {
                fields: {
                    'ShowCard': {
                        field: 'ShowCard',
                        defaultValue: 3
                    }
                }
            }
        },
       
    };
    var dataSource = new kendo.data.DataSource(dataSourceOptions);
    var settingsViewModel = kendo.observable({
        dataSource: dataSource,
        fields: {
            showCard: '',
        },
        submit: function () {},
        cancel: function () {},
        onChange: function (e) {

            var dataSource = settingsViewModel.get('dataSource');
           
            var item = dataSource.at(0);
            item.set('ShowCard', settingsViewModel.fields.showCard);
            dataSource.sync();

        },
        logout: function (event) {

            dataProvider.Users.logout(function () {
                //      event.preventDefault();
                //       this.loginView.set("username", "");
                //     this.loginView.set("password", "");
                app.mobileApp.navigate('components/authenticationView/view.html');
            }, function () {
                navigator.notification.alert("Unfortunately an error occurred logging out of your account.");
            });
            console.log(dataProvider.Users);
        },
    });

    parent.set('settingsViewModel', settingsViewModel);
})(app.settingsView);

// START_CUSTOM_CODE_settingsViewModel
// END_CUSTOM_CODE_settingsViewModel