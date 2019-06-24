document.addEventListener('DOMContentLoaded', function() {
    var select = document.querySelectorAll('select');
    var instances = M.FormSelect.init(select);
  });

  document.addEventListener('DOMContentLoaded', function() {
    var dpicker = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(dpicker);
  });

  document.addEventListener('DOMContentLoaded', function() {
    var tpicker = document.querySelectorAll('.timepicker');
    var instances = M.Timepicker.init(tpicker);
  });

  console.log('Js is working');