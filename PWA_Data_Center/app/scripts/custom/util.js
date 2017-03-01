/**
 * Created by Mirco on 24.02.2017.
 */

'use strict';

define(function (require) {

  const Database = require('DatabaseRequestHandler');

  function Util() {
    this.boxes = [];
    this.database = new Database();
    this.$ = require('jquery');
  }

  Util.prototype = {
    log: function (fct, msg) {
      console.log('[' + fct + ']', msg);
    },

    insertMdlList: function (containerId, settings) {
      var list = '<ul class="demo-list-control mdl-list"> ';
      var listItems = '';
      var keys = Object.keys(settings);
      for ( let i = 0; i < keys.length; i++ ) {
        listItems += '<li class="mdl-list__item"> ' +
        '<span class="mdl-list__item-primary-content"> ' +
        '<i class="material-icons  mdl-list__item-avatar">network_check</i>' +
          keys[i] +
        '</span> ' +
        '<span class="mdl-list__item-secondary-action"> ' +
        '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-select" for="' + keys[i] + '_' + containerId + '_' + 'list-switch"> ' +
        '<input type="checkbox" id="' + keys[i] + '_' + containerId + '_' + 'list-switch" class="mdl-checkbox__input" ' + (settings[keys[i]] ? 'checked' : '') + ' /> ' +
        '</label> ' +
        '</span> ' +
        '</li> ';
      }

      list += listItems + '</ul>';
      document.getElementById(containerId).innerHTML += list;
    },

    addEventHandlerForSettingBoxes: function () {
      var that = this;
      this.boxes = document.querySelectorAll('ul .mdl-data-select');
      for ( let i = 0; i < this.boxes.length; i++ ) {
        this.boxes[i].MaterialCheckbox = new MaterialCheckbox(this.boxes[i]);
        var input = this.boxes[i].querySelector('input');
        var handlerMethod = function(event) {
          var temp = that.$(this).attr('id').split('_');
          var host = temp[1];
          var method = temp[0];
          var checked = event.target.checked;
          that.database.setMethodOfHost(host,method, checked);
        };
        input.addEventListener('change', handlerMethod);
      }
    },

    insertSettingsContainer: function (containerId, name) {
      var container = '<section class="section--center mdl-grid mdl-shadow--2dp">' +
        '<h4 class="mdl-cell mdl-cell--12-col">' + name + '</h4>' +
        '<div class="mdl-card mdl-cell mdl-cell--12-col"> ' +
        '<div class="mdl-card__supporting-text"> ' +
        '<div id="' + name + '">' +
        '</div> ' +
        '</div> ' +
        '</div>' +
        '</section>';

      document.getElementById(containerId).innerHTML += container;
      return name;
    },

    displayHostOnLandingPage: function (host) {
      var container = document.querySelector('#apps');
      var html = '<section class="section--center mdl-grid mdl-shadow--4dp">' +
        '<h4 class="mdl-cell mdl-cell--12-col">' + host + '</h4>' +
        '<div class="mdl-card mdl-cell mdl-cell--12-col"> ' +
        '<iframe sandbox="allow-scripts allow-forms allow-pointer-lock allow-same-origin" class="preview" src="' + host +'" style="height: 400px; filter: blur(1px) grayscale(100%); -webkit-filter: grayscale(100%);" scrolling="no">' +
        '</iframe>'+
        '<div class="mdl-card__actions mdl-shadow--2dp" style="margin-top: 10px"> ' +
        '<a target="_blank" href="' + host + '" class="mdl-button">Go to the application</a> ' +
        '</div>' +
        '</div>' +
        '</section>';
      container.innerHTML += html;
    }
  };

  return Util;
});