var common = {
    confirm: function (params) {
        if ($("#common_confirm_model").length == 0) {
            $("body").append("<!-- confirm -->" +
                '<div id="common_confirm_model" class= "modal" tabindex = "-1" role = "dialog" data-backdrop = "static">' +
                '<div class="modal-dialog modal-sm" style="margin-top:200px" role="document">' +
                '<div class="modal-content">' +
                //'<div class="modal-header">' +
                //'<h4 class="common_confirm_modal_title" class="modal-title">提示</h4>' +
                //'</div>' +
                '<div class="modal-body">' +
                '<p class="common_confirm_modal_text" style="font-size:16px;margin-bottom:0px"></p>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-success ok" data-dismiss="modal">确定</button>' +
                '<button type="button" class="btn btn-default cancel" data-dismiss="modal">取消</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            );
        }

        var model = $("#common_confirm_model");

        model.find(".common_confirm_modal_text").html(params.text);

        $("#common_confirm_btn").click();
        //每次都将监听先关闭，防止多次监听发生，确保只有一次监听
        model.find(".cancel").off("click");
        model.find(".ok").off("click");

        model.find(".ok").on("click", function () {
            if (params.operate) {
                params.operate(true);
            }
        });

        model.find(".cancel").on("click", function () {
            if (params.operate) {
                params.operate(false)
            }
        });

        if (params.hasOwnProperty("onekey")) {
            if (params.onekey) {
                model.find(".cancel").addClass("hidden");
            } else {
                model.find(".cancel").removeClass("hidden");
            }
        } else {
            model.find(".cancel").removeClass("hidden");
        }

        model.modal("show");
    },
    alert: function (text, title, callback) {
        if ($("#common_alert_modal").length == 0) {
            $("body").append("<!-- alert -->" +
                '<div id="common_alert_modal" class= "modal" tabindex = "-1" role = "dialog" data-backdrop = "static">' +
                '<div class="modal-dialog modal-sm" style="margin-top:200px" role="document">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h4 class="common_alert_modal_title" class="modal-title">请确认操作</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<p class="common_alert_modal_text" style="font-size:16px;margin-bottom:0px"></p>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-success" style="width:100%" data-dismiss="modal">确定</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            );
        }

        var model = $("#common_alert_modal");
        if (typeof (text) != "undefined") {
            model.find(".common_alert_modal_text").html(text);
        } else {
            return;
        }
        if (typeof (title) != "undefined" && title != "") {
            model.find(".common_alert_modal_title").html(title);
            model.find(".common_alert_modal_title").parent().show();
        } else {
            model.find(".common_alert_modal_title").parent().hide();
        }
        model.modal("show");
    },
    showLoading: function (text) {
        if ($("#common_loading_modal").length == 0) {
            $("body").append("<!-- loading -->" +
                "<div class='modal' id='common_loading_modal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' data-backdrop='static'>" +
                //"<div class='modal-dialog text-center' style='width:300px;padding:30px;color:#fff;margin-top: 200px;' role='document'>" +
                //<i class="fa fa-fw fa-spinner fa-3x fa-spin"></i>' +
                "<div class='modal-dialog t-center' style='width:300px;padding:30px;color:#fff;margin-top: 200px;' role='document'>" +
                '<image style="margin-bottom:10px" src="images/loading.gif">' +
                "<h4 class='loading_modal_text' class='modal-body'></h4>" +
                "</div>" +
                "</div>"
            );
        }
        var model = $("#common_loading_modal");
        if (typeof (text) != "undefined") {
            model.find(".loading_modal_text").html(text);
        } else {
            model.find(".loading_modal_text").html("");
        }
        model.modal("show");
    },
    hideLoading: function () {
        $("#common_loading_modal").modal("hide");
    },
    funcAjax: function (ajaxUrl, ajaxData, ajaxSuccess, ajaxError, isShowLoading) {
        if(ajaxData === ""){
            ajaxData={};
        }
        if (isShowLoading == false) {} else {
            $.showLoading("请稍候...");
        }
        return $.ajax({
            type: 'post',
            contentType: 'application/json',
            url: ajaxUrl,
            data: JSON.stringify(ajaxData),
            dataType: 'json',
            cache: false,
            timeout: 30000,
            headers: {
                Accept: "application/json; charset=utf-8",
                //userToken: "" + common.getUserInfo().token
                token: "" + common.getUserInfo().token
            },
            error: function (msg) {
                if (ajaxError){
                    ajaxError(msg);
                }
                if (isShowLoading == false) {} else {
                    common.hideLoading();
                }
            },
            success: function (obj) {
                if(obj.resultCode === 0 ){
                    ajaxSuccess(obj);
                }else if (obj.resultCode ===1005 ){
                    common.alert("您的登陆信息已过期，请重新登录,页面将在5秒后自动跳转。");
                    setTimeout(function(){
                        location.href="../index.html";
                    }, 5000);
                }else{
                    if (ajaxError){
                        ajaxError(obj);
                    }
                }
                if (isShowLoading == false) {} else {
                    common.hideLoading();
                }
            }
        });
    },
    formatMsgTime: function (timespan) {

        var dateTime = new Date(timespan);

        var year = dateTime.getFullYear();
        var month = dateTime.getMonth() + 1;
        var day = dateTime.getDate();
        var hour = dateTime.getHours();
        var minute = dateTime.getMinutes();
        var second = dateTime.getSeconds();
        var now = new Date();
        var now_new = Date.parse(now.toDateString()); //typescript转换写法

        var milliseconds = 0;
        var timeSpanStr;

        milliseconds = now_new - timespan;

        if (milliseconds <= 1000 * 60 * 1) {
            timeSpanStr = '刚刚';
        } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
            timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
        } else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
        } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
        } else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
            timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
        } else {
            timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
        }
        return timeSpanStr;
    }
};

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
    'use strict';
  
    // MODAL CLASS DEFINITION
    // ======================
  
    var Modal = function (element, options) {
      this.options             = options
      this.$body               = $(document.body)
      this.$element            = $(element)
      this.$dialog             = this.$element.find('.modal-dialog')
      this.$backdrop           = null
      this.isShown             = null
      this.originalBodyPad     = null
      this.scrollbarWidth      = 0
      this.ignoreBackdropClick = false
  
      if (this.options.remote) {
        this.$element
          .find('.modal-content')
          .load(this.options.remote, $.proxy(function () {
            this.$element.trigger('loaded.bs.modal')
          }, this))
      }
    }
  
    Modal.VERSION  = '3.3.7'
  
    Modal.TRANSITION_DURATION = 300
    Modal.BACKDROP_TRANSITION_DURATION = 150
  
    Modal.DEFAULTS = {
      backdrop: false,
      keyboard: true,
      show: true
    }
  
    Modal.prototype.toggle = function (_relatedTarget) {
      return this.isShown ? this.hide() : this.show(_relatedTarget)
    }
  
    Modal.prototype.show = function (_relatedTarget) {
      var that = this
      var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })
  
      this.$element.trigger(e)
  
      if (this.isShown || e.isDefaultPrevented()) return
  
      this.isShown = true
  
      this.checkScrollbar()
      this.setScrollbar()
      this.$body.addClass('modal-open')
  
      this.escape()
      this.resize()
  
      this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))
  
      this.$dialog.on('mousedown.dismiss.bs.modal', function () {
        that.$element.one('mouseup.dismiss.bs.modal', function (e) {
          if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
        })
      })
  
      this.backdrop(function () {
        var transition = $.support.transition && that.$element.hasClass('fade')
  
        if (!that.$element.parent().length) {
          that.$element.appendTo(that.$body) // don't move modals dom position
        }
  
        that.$element
          .show()
          .scrollTop(0)
  
        that.adjustDialog()
  
        if (transition) {
          that.$element[0].offsetWidth // force reflow
        }
  
        that.$element.addClass('in')
  
        that.enforceFocus()
  
        var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })
  
        transition ?
          that.$dialog // wait for modal to slide in
            .one('bsTransitionEnd', function () {
              that.$element.trigger('focus').trigger(e)
            })
            .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
          that.$element.trigger('focus').trigger(e)
      })
    }
  
    Modal.prototype.hide = function (e) {
      if (e) e.preventDefault()
  
      e = $.Event('hide.bs.modal')
  
      this.$element.trigger(e)
  
      if (!this.isShown || e.isDefaultPrevented()) return
  
      this.isShown = false
  
      this.escape()
      this.resize()
  
      $(document).off('focusin.bs.modal')
  
      this.$element
        .removeClass('in')
        .off('click.dismiss.bs.modal')
        .off('mouseup.dismiss.bs.modal')
  
      this.$dialog.off('mousedown.dismiss.bs.modal')
  
      $.support.transition && this.$element.hasClass('fade') ?
        this.$element
          .one('bsTransitionEnd', $.proxy(this.hideModal, this))
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        this.hideModal()
  
      //add by liumingzhen 2017-07-17
      this.$element.find('.easytip').hide();
      this.$element.find('.modal-group-focus').removeClass('modal-group-focus');
      this.$element.find('.modal-group-error').removeClass('modal-group-error');
      this.$element.find('.prompt').hide();
    }
  
    Modal.prototype.enforceFocus = function () {
      $(document)
        .off('focusin.bs.modal') // guard against infinite focus loop
        .on('focusin.bs.modal', $.proxy(function (e) {
          if (document !== e.target &&
              this.$element[0] !== e.target &&
              !this.$element.has(e.target).length) {
            this.$element.trigger('focus')
          }
        }, this))
    }
  
    Modal.prototype.escape = function () {
      if (this.isShown && this.options.keyboard) {
        this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
          e.which == 27 && this.hide()
        }, this))
      } else if (!this.isShown) {
        this.$element.off('keydown.dismiss.bs.modal')
      }
    }
  
    Modal.prototype.resize = function () {
      if (this.isShown) {
        $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
      } else {
        $(window).off('resize.bs.modal')
      }
    }
  
    Modal.prototype.hideModal = function () {
      var that = this
      this.$element.hide()
      this.backdrop(function () {
        if($('body').find('.modal.in').length==0){
        that.$body.removeClass('modal-open')
        that.resetAdjustments()
        that.resetScrollbar()
        }
        that.$element.trigger('hidden.bs.modal')
      })
    }
  
    Modal.prototype.removeBackdrop = function () {
      this.$backdrop && this.$backdrop.remove()
      this.$backdrop = null
    }
  
    Modal.prototype.backdrop = function (callback) {
      var that = this
      var animate = this.$element.hasClass('fade') ? 'fade' : ''
  
      if (this.isShown && this.options.backdrop) {
        var doAnimate = $.support.transition && animate
  
        this.$backdrop = $(document.createElement('div'))
          .addClass('modal-backdrop ' + animate)
          .appendTo(this.$body)
  
        this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
          if (this.ignoreBackdropClick) {
            this.ignoreBackdropClick = false
            return
          }
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static'
            ? this.$element[0].focus()
            : this.hide()
        }, this))
  
        if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
  
        this.$backdrop.addClass('in')
  
        if (!callback) return
  
        doAnimate ?
          this.$backdrop
            .one('bsTransitionEnd', callback)
            .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
          callback()
  
      } else if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass('in')
  
        var callbackRemove = function () {
          that.removeBackdrop()
          callback && callback()
        }
        $.support.transition && this.$element.hasClass('fade') ?
          this.$backdrop
            .one('bsTransitionEnd', callbackRemove)
            .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
          callbackRemove()
  
      } else if (callback) {
        callback()
      }
    }
  
    // these following methods are used to handle overflowing modals
  
    Modal.prototype.handleUpdate = function () {
      this.adjustDialog()
    }
  
    Modal.prototype.adjustDialog = function () {
      var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight
  
      this.$element.css({
        paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
        paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
      })
    }
  
    Modal.prototype.resetAdjustments = function () {
      this.$element.css({
        paddingLeft: '',
        paddingRight: ''
      })
    }
  
    Modal.prototype.checkScrollbar = function () {
      var fullWindowWidth = window.innerWidth
      if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
        var documentElementRect = document.documentElement.getBoundingClientRect()
        fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
      }
      this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
      this.scrollbarWidth = this.measureScrollbar()
    }
  
    Modal.prototype.setScrollbar = function () {
      var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
      this.originalBodyPad = document.body.style.paddingRight || ''
      if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    }
  
    Modal.prototype.resetScrollbar = function () {
      this.$body.css('padding-right', this.originalBodyPad)
    }
  
    Modal.prototype.measureScrollbar = function () { // thx walsh
      var scrollDiv = document.createElement('div')
      scrollDiv.className = 'modal-scrollbar-measure'
      this.$body.append(scrollDiv)
      var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
      this.$body[0].removeChild(scrollDiv)
      return scrollbarWidth
    }
  
  
    // MODAL PLUGIN DEFINITION
    // =======================
  
    function Plugin(option, _relatedTarget) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.modal')
        var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)
  
        if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
        if (typeof option == 'string') data[option](_relatedTarget)
        else if (options.show) data.show(_relatedTarget)
      })
    }
  
    var old = $.fn.modal
  
    $.fn.modal             = Plugin
    $.fn.modal.Constructor = Modal
  
  
    // MODAL NO CONFLICT
    // =================
  
    $.fn.modal.noConflict = function () {
      $.fn.modal = old
      return this
    }
  
  
    // MODAL DATA-API
    // ==============
  
    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
      var $this   = $(this)
      var href    = $this.attr('href')
      var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
      var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())
  
      if ($this.is('a')) e.preventDefault()
  
      $target.one('show.bs.modal', function (showEvent) {
        if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
        $target.one('hidden.bs.modal', function () {
          $this.is(':visible') && $this.trigger('focus')
        })
      })
      Plugin.call($target, option, this)
    })
  
  }(jQuery);

  (function($,window,document){
    var Tips = function (opt) {
        var _this = this;
        this.option = opt || {};
        this.$wrapper = $('<div class="tips"></div>>');
        this.render();
        setTimeout(function () {
            _this.$wrapper.remove();
        },2000);
    };

    Tips.prototype = {
      render:function () {
          var html = '<div class="tips-content"><span>'+this.option.msg+'</span></div>';
          this.$wrapper.html(html);
          $(document.body).append(this.$wrapper);
      }
    };

    Tips.DEFAULTS = {
      "msg":"这里写提示信息"
    };

    $.extend({
       tips:function (option) {
           var options = $.extend({},Tips.DEFAULTS,typeof option == 'object' && option);
           new Tips(options);
       }
    });
})(jQuery,window,document);
  