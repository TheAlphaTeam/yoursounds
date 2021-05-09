'use strict';


$(function () {
  if (window.localStorage.user) {
    $('#login').hide();
    $('#signup').hide();
    $('#loginout').show();
  } else {
    $('#login').show();
    $('#signup').show();
    $('#loginout').hide();
  }
});




$('#login').submit(function (e) {

  e.preventDefault();
  if ($('#emailL').val() === '' || $('#passwordL').val() === '') {
    alert('Please fill field!');
    return;
  }

  $.post('/login', { email: $('#emailL').val().toLowerCase(), password: $('#passwordL').val() }, function (data, status) {

    if (data === `Password or Unsername not correct!`)
      alert(data);
    else {
      window.localStorage.setItem('user', data);
      console.log(' file: app.js ~ line 36 ~ data', data);
      window.location.href = `/myprofile/${JSON.parse(data).username}`;
    }

  });
});


$('#loginout').submit(function (e) {

  e.preventDefault();
  window.localStorage.removeItem('user');
  window.location.href = '/';
});

$('#logout').submit(function (e) {

  e.preventDefault();
  window.localStorage.removeItem('user');
  window.location.href = '/';
});


$('#signup').submit(function (e) {
  e.preventDefault();
  if ($('#email').val() === '' || $('#pass1').val() === '' || $('#name').val() === '') {
    alert('Please fill field!');
    return;
  }

  if ($('#pass1').val() !== $('#pass2').val()) {
    alert('Your password not match!');
    return;
  }
  $.post('/singUp', { name: $('#name').val(), email: $('#email').val().toLowerCase(), password: $('#pass1').val() }, function (data, status) {

    if (data === `This user is aleady signed up!`)
      alert(data);
    else {
      window.localStorage.setItem('user', data);
      window.location.href = `/myprofile/${JSON.parse(data).username}`;

    }

  });
});


// $('.username').attr('value',JSON.parse(window.localStorage.getItem('user')).username);

