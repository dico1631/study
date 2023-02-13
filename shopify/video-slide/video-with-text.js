  // Manage videos
  theme.VideoManager = new function () {
    var _ = this;

    _._permitPlayback = function (container) {
      return !($(container).hasClass('video-container--background') && $(window).outerWidth() < 768);
    };

    // Youtube
    _.youtubeVars = {
      incrementor: 0,
      apiReady: false,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="youtube"]:not(.video--init)' };


    _.youtubeApiReady = function () {
      _.youtubeVars.apiReady = true;
      _._loadYoutubeVideos();
    };

    _._loadYoutubeVideos = function (container) {
      
      if ($(_.youtubeVars.toProcessSelector, container).length) {
        if (_.youtubeVars.apiReady) {

          // play those videos
          $(_.youtubeVars.toProcessSelector, container).each(function () {
            // Don't init background videos on mobile
            if (_._permitPlayback($(this))) {
              $(this).addClass('video--init');
              _.youtubeVars.incrementor++;
              var containerId = 'theme-yt-video-' + _.youtubeVars.incrementor;
              $(this).data('video-container-id', containerId);
              var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).
              appendTo($('.video-container__video', this));
              var autoplay = $(this).data('video-autoplay');
              var loop = $(this).data('video-loop');
              var player = new YT.Player(containerId, {
                height: '360',
                width: '640',
                videoId: $(this).data('video-id'),
                playerVars: {
                  iv_load_policy: 3,
                  modestbranding: 1,
                  autoplay: 0,
                  loop: loop ? 1 : 0,
                  playlist: $(this).data('video-id'),
                  rel: 0,
                  showinfo: 0 },

                events: {
                  onReady: _._onYoutubePlayerReady.bind({ autoplay: autoplay, loop: loop, $container: $(this) }),
                  onStateChange: _._onYoutubePlayerStateChange.bind({ autoplay: autoplay, loop: loop, $container: $(this) }) } });


              _.youtubeVars.videoData[containerId] = {
                id: containerId,
                container: this,
                videoElement: videoElement,
                player: player };

            }
          });
        } else {
          // load api
          theme.loadScriptOnce('https://www.youtube.com/iframe_api');
        }
      }
    };

    _._onYoutubePlayerReady = function (event) {
      event.target.setPlaybackQuality('hd1080');
      if (this.autoplay) {
        event.target.mute();
        event.target.playVideo();
      }

      _._initBackgroundVideo(this.$container);
    };

    _._onYoutubePlayerStateChange = function (event) {
      if (event.data == YT.PlayerState.PLAYING) {
        this.$container.addClass('video--play-started');

        if (this.autoplay) {
          event.target.mute();
        }

        if (this.loop) {
          // 4 times a second, check if we're in the final second of the video. If so, loop it for a more seamless loop
          var finalSecond = event.target.getDuration() - 1;
          if (finalSecond > 2) {
            function loopTheVideo() {
              if (event.target.getCurrentTime() > finalSecond) {
                event.target.seekTo(0);
              }
              setTimeout(loopTheVideo, 250);
            }
            loopTheVideo();
          }
        }
      }
    };

    _._unloadYoutubeVideos = function (container) {
      for (var dataKey in _.youtubeVars.videoData) {
        var data = _.youtubeVars.videoData[dataKey];
        if ($(container).find(data.container).length) {
          data.player.destroy();
          delete _.youtubeVars.videoData[dataKey];
          return;
        }
      }
    };

    // Init third party apis - Youtube and Vimeo
    _._loadThirdPartyApis = function (container) {
      //Don't init youtube or vimeo background videos on mobile
      if (_._permitPlayback($('.video-container', container))) {
        _._loadYoutubeVideos(container);
      }
    };

    // Mp4
    _.mp4Vars = {
      incrementor: 0,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="mp4"]:not(.video--init)' };


    _._loadMp4Videos = function (container) {
      if ($(_.mp4Vars.toProcessSelector, container).length) {
        // play those videos
        $(_.mp4Vars.toProcessSelector, container).addClass('video--init').each(function () {
          _.mp4Vars.incrementor++;
          var $this = $(this);
          var containerId = 'theme-mp-video-' + _.mp4Vars.incrementor;
          $(this).data('video-container-id', containerId);
          var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).
          appendTo($('.video-container__video', this));

          var $video = $('<video playsinline>');
          if ($(this).data('video-loop')) {
            $video.attr('loop', 'loop');
          }
          if (!$(this).hasClass('video-container--background')) {
            $video.attr('controls', 'controls');
          }
          if ($(this).data('video-autoplay')) {
            $video.attr({ autoplay: 'autoplay', muted: 'muted' });
            $video[0].muted = true; // required by Chrome - ignores attribute
            $video.one('loadeddata', function () {
              this.play();
            });
          }
          $video.on('playing', function () {
            $(this).addClass('video--play-started');
          }.bind(this));
          $video.attr('src', $(this).data('video-url')).appendTo(videoElement);
          _.mp4Vars.videoData[containerId] = {
            element: $video[0] };

        });
      }
    };

    _._unloadMp4Videos = function (container) {
    };

    // Compatibility with Sections
    this.onSectionLoad = function (container) {
      // url only - infer type
      $('.video-container[data-video-url]:not([data-video-type])').each(function () {
        var url = $(this).data('video-url');

        if (url.indexOf('.mp4') > -1) {
          $(this).attr('data-video-type', 'mp4');
        }

        if (url.indexOf('youtu.be') > -1 || url.indexOf('youtube.com') > -1) {
          $(this).attr('data-video-type', 'youtube');
          if (url.indexOf('v=') > -1) {
            $(this).attr('data-video-id', url.split('v=').pop().split('&')[0]);
          } else {
            $(this).attr('data-video-id', url.split('?')[0].split('/').pop());
          }
        }
      });

      // _._loadThirdPartyApis(container);
      _._loadMp4Videos(container);

      // $(window).on('debouncedresize.video-manager-resize', function () {
      //   _._loadThirdPartyApis(container);
      // });

      // play button
      $('.video-container__play', container).on('click', function (evt) {
        console.log('video-container__play Å¬¸¯');
        evt.preventDefault();
        var $container = $(this).closest('.video-container');
        // reveal
        $container.addClass('video-container--playing');

        // broadcast a play event on the section container
        $(container).trigger("cc:video:play");

        // play
        console.log($container);
        var id = $container.data('video-container-id');
        console.log(id);
        if (id.indexOf('theme-mp-video') === 0) {
          _.mp4Vars.videoData[id].element.play();
        }

        // if (id.indexOf('theme-yt-video') === 0) {
        //   _.youtubeVars.videoData[id].player.playVideo();
        // } else if (id.indexOf('theme-vi-video') === 0) {
        //   _.vimeoVars.videoData[id].player.play();
        // } else if (id.indexOf('theme-mp-video') === 0) {
        //   _.mp4Vars.videoData[id].element.play();
        // }
      });

      // modal close button
      $('.video-container__stop', container).on('click', function (evt) {
        evt.preventDefault();
        var $container = $(this).closest('.video-container');
        // hide
        $container.removeClass('video-container--playing');

        // broadcast a stop event on the section container
        $(container).trigger("cc:video:stop");

        // play
        var id = $container.data('video-container-id');
        if (id.indexOf('theme-yt-video') === 0) {
          _.youtubeVars.videoData[id].player.stopVideo();
        } else {
          _.vimeoVars.videoData[id].player.pause();
          _.vimeoVars.videoData[id].player.setCurrentTime(0);
        }
      });
    };

    this.onSectionUnload = function (container) {
      $('.video-container__play, .video-container__stop', container).off('click');
      $(window).off('.' + $('.video-container').data('video-container-id'));
      $(window).off('debouncedresize.video-manager-resize');
      _._unloadYoutubeVideos(container);
      _._unloadVimeoVideos(container);
      _._unloadMp4Videos(container);
      $(container).trigger("cc:video:stop");
    };
  }();

  // Youtube API callback
  window.onYouTubeIframeAPIReady = function () {
    theme.VideoManager.youtubeApiReady();
  };

  // Register the section
  cc.sections.push({
    name: 'video',
    section: theme.VideoManager });