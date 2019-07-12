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

document.addEventListener('DOMContentLoaded', function () {
  var mnav = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(mnav);
});

// let phone = document.getElementById('phone');
// document.addEventListener('keyup', phone, formatPhone);

// function formatPhone(e) {
//   phone = phone.innerText
//   phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
//   console.log(phone);
// }