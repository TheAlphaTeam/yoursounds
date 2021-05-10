'use strict';


$(function () {
  if (window.localStorage.user) {
    $('#login').hide();
    $('#signup').hide();
    $('#logout').show();
  } else {
    $('#login').show();
    $('#signup').show();
    $('#logout').hide();
  }
});


$('#songslist').click(function(){
  $('#resultsSongsList').show();
  $('#resultsEventsList').hide();
});
$('#eventslist').click(function(){
  $('#resultsSongsList').hide();
  $('#resultsEventsList').show();
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







$('body #addSong').submit(function (e) {
  e.preventDefault();
  $.post(`/addsong/${e.target.user.value}`, { title:e.target.title.value , preview: e.target.preview.value,
  image: e.target.image.value,name: e.target.name.value}, function (data, status) {
$(`#${e.target.id.value}`).html(data);
  });
});



// $('.addSong').submit(function (e) {

//   e.preventDefault();

//   $.post(`/addsong/${$('#user').val()}`, { title: $('#title').val(), preview: $('#preview').val(),
//   image: $('#image').val(),name: $('#name').val()}, function (data, status) {


// $(`#${$('#id').val()}`).html(data);
// console.log($('#id').val());
// ;
//   });
// });


$('#deleteSong').submit(function (e) {
  e.preventDefault();

  $.post(`/addsong/${$('#user').val()}`, { title: $('#title').val(), preview: $('#preview').val(),
  image: $('#image').val(),name: $('#name').val()}, function (data, status) {


window.location.href=`/myprofile/${$('#user').val()}`;
  });
});


// function change(){
//   document.getElementById('myButton1').innerHTML = '&#10084;';
// }

// $('.username').attr('value',JSON.parse(window.localStorage.getItem('user')).username);

