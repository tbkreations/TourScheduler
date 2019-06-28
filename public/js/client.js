document.addEventListener('DOMContentLoaded', function () {
  var select = document.querySelectorAll('select');
  var instances = M.FormSelect.init(select);
});

document.addEventListener('DOMContentLoaded', function () {
  var dpicker = document.querySelectorAll('.datepicker');
  var max = new Date();
  max.setTime(new Date().getTime() + 60000 * 60 * 24 * 14);
  var instances = M.Datepicker.init(dpicker, {
    disableDayFn: function (date) {
      if (date.getDay() == 0) {
        return true;
      } else {
        return false;
      }
    },
    minDate: today = new Date,
    maxDate: max,
    container: document.body,
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var tpicker = document.querySelectorAll('.timepicker');
  var instances = M.Timepicker.init(tpicker, {
    defaultTime: "09:00"
  });
});

