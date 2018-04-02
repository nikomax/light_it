const itemContainer = $('.item-wrapper');
const commentsContainer = $('.comments');
let itemsData;
let itemDataId;
let itemCommentsData;
let userRegisterData;
let userLogInData = {
  'success': false
};

const addButtons = (itemId, label) => {
  $('.buttons').append(`<button class="btn js-item-btn" data-item-id="${itemId}">${label}</button>`);
  $('.js-item-btn').on('click', function() {
    itemDataId = $(this).data('item-id');
    itemsData.forEach((item) => {
      if(item.id === itemDataId) {
        addItem(itemContainer, item.img, item.title, item.text, item.id);
        $.get(`http://smktesting.herokuapp.com/api/reviews/${itemDataId}`, function(data) {
          itemCommentsData = data;
          $('.leave-comment').html(' <textarea name="" id="" cols="30" rows="10" class="js-comment-text"></textarea>' +
            '<input type="text" class="js-rate">' +
            '<button class="js-send-comment">add</button>');
          commentsContainer.html('');
          for(let i=0; i < itemCommentsData.length; i++) {
            addComments(itemCommentsData[i]);
          }
        });
      }
    });
  });
};

const addComments = (item) => {
  commentsContainer.append(`<div class="comment">
  ${item.text}
</div>`);
};

const addItem = (container, img, title, text, itemId) => {
  container.html(`<div class="item" data-item-id="${itemId}">
      <div class="item__image">
        <img src="http://smktesting.herokuapp.com/static/${img}" alt="">
      </div>
      <div class="item__title">
        ${title}
      </div>
      <div class="item__desc">
        ${text}
      </div>
    </div>`);
};

$.get('http://smktesting.herokuapp.com/api/products/', function(data) {
  itemsData = data;
  for(let i=0; i < itemsData.length; i++) {
    addButtons(itemsData[i].id, itemsData[i].title);
  }
});

$('.js-send-comment').on('click', function() {
  console.log('bla');
  let commentSendData = {
    'rate': $('.js-rate').val(),
    'text': $('.js-comment-text').val()
  };
  if ( userLogInData.success ) {
    $.post(`http://smktesting.herokuapp.com/api/reviews/${itemDataId}`, commentSendData, function(data) {
      console.log(data);
    });
    $.get(`http://smktesting.herokuapp.com/api/reviews/${itemDataId}`, function(data) {
      itemCommentsData = data;
      commentsContainer.html('');
      for(let i=0; i < itemCommentsData.length; i++) {
        addComments(itemCommentsData[i]);
      }
    });
  } else {
    alert('Log in');
  }
});

$('.js-popup-link').on('click',function(e) {
  e.preventDefault();
  let popupAction = $(this).data('action');
  $('.js-popup').fadeIn();
  if (popupAction === 'login' ) {
    $('.js-popup-action').html('<button class="js-log-in">Log in</button>');
    $('.js-log-in').on('click', function(e) {
      e.preventDefault();
      let userSendData = {
        'username': $('.js-user-name').val(),
        'password': $('.js-password').val()
      };
      $.post('http://smktesting.herokuapp.com/api/login/', userSendData, function(data) {
        userLogInData = data;
        console.log(userLogInData);
      });
    });
  } else {
    $('.js-popup-action').html('<button class="js-register">Registration</button>');
    $('.js-register').on('click', function(e) {
      e.preventDefault();
      let userSendData = {
        'username': $('.js-user-name').val(),
        'password': $('.js-password').val()
      };
      $.post('http://smktesting.herokuapp.com/api/register/', userSendData, function(data) {
        userRegisterData = data;
      });
    });
  }
});

$('.js-popup-close').on('click', function() {
  $(this).parents('.js-popup').fadeOut().find('.js-popup-action').html('');
});
