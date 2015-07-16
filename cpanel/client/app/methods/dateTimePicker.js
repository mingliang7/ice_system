DateTimePicker = {
    // dateTimePicker
    date: function (element) {
        element.datetimepicker({
            format: 'YYYY-MM-DD'
        });
    },
    dateTime: function (element) {
        element.datetimepicker({
            format: 'YYYY-MM-DD HH:mm:ss'
        });
    },
    time: function (element) {
        element.datetimepicker({
            format: 'HH:mm:ss'
        });
    },
    // datePicker
    date2: function (element) {
        element.datepicker({
            format: 'yyyy-mm-dd',
            //clearBtn: true,
            //todayBtn: "linked",
            todayHighlight: true,
            autoclose: true
        });
    },
    // dateRange
    dateRange: function (element) {
        element.daterangepicker(
            {
                format: 'YYYY-MM-DD',
                separator: ' To '
            });
    },
    dateTimeRange: function (element) {
        element.daterangepicker(
            {
                timePicker: true,
                format: 'YYYY-MM-DD HH:mm:ss',
                separator: ' To ',
                timePickerIncrement: 30,
                timePicker12Hour: false,
                timePickerSeconds: true
            });
    }
};
