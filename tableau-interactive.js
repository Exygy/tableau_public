(function($) {
  /*
  Render any available Tableau interactives.
  */
  $(function() {
    // Check if there is any Tableau interactive data on this page
    if (Drupal.settings.tableau_data && Drupal.settings.tableau_data.length > 0) {
      var vizzesData = Drupal.settings.tableau_data;
      var vizzes = {};

      var baseVizOptions = {
        hideTabs: true
      };

      var $titleTemplate = $('<h3 class="chart-title">');
      var $buttonGroupWrapperTemplate = $('<div class="btn-group btn-group-justified margin-top margin-bottom">');
      var $buttonTemplate = $('<a class="btn btn-primary btn-fix k-button">');

      // Go through each Tableau interactive's data and render it on the page
      $.each(vizzesData, function(index, data) {
        var $interactiveWrapper = $('#' + data.id),
          vizID,
          $viz,
          multipleSheets = data.sheets && data.sheets.length > 1,
          btnClass = data.id + '-btn',
          $title;

        data.dynamic_title = parseInt(data.dynamic_title);

        // Remove any parameters from url
        data.url = data.url.replace(/\?.*/, '');

        // Create the viz title
        $title = $titleTemplate.clone().text(data.title);
        $interactiveWrapper.append($title);

        // If there are multiple sheets, create buttons for each sheet
        if (multipleSheets) {
          var $buttonGroupWrapper = $buttonGroupWrapperTemplate.clone();
          $buttonGroupWrapper.attr('data-viz-url', data.url);

          // Create each button
          $.each(data.sheets, function(index, sheet) {
            var $button = $buttonTemplate.clone();
            $button.addClass(btnClass);
            $button.attr('data-sheet-name', sheet.name);
            $button.text(sheet.name);
            $buttonGroupWrapper.append($button.clone());
          });

          // Add the buttons above the Tableau interactive container
          $interactiveWrapper.append($buttonGroupWrapper);
          data.$buttons = $buttonGroupWrapper;

          // Set button click handler
          $('body').on('click', '.' + btnClass, function() {
            $(this).siblings('a').removeClass('active');
            $(this).addClass('active');
            var sheetName = $(this).data('sheet-name');

            // Switch to the appropriate sheet within the viz's workbook,
            // and update the record we're keeping of which sheet was
            // most recently active - we can use that to set the viz to the
            // correct active sheet when we re-render the viz on page resize
            var vizUrl = $(this).parent().data('viz-url');
            var viz = vizzes[vizUrl];
            viz.getWorkbook().activateSheetAsync(sheetName);
            viz.data.activeSheet = sheetName;

            // If the dynamic title option is set for this interactive,
            // update the title with the current sheet's name
            if (viz.data.dynamic_title) {
              viz.data.$title.text(viz.data.title + ' — ' + sheetName);
            }
          });
        }

        // Initialize the viz
        vizID = data.id + '_viz';
        $viz = $('<div id="' + vizID + '">');
        $interactiveWrapper.append($viz);
        var options = {device: $(window).width() < 768 ? 'phone' : 'desktop'};
        options.onFirstInteractive = function(e) {
          var thisViz = e.$1;
          var thisVizUrl = thisViz._impl.$1n.$2;
          $(thisViz.getParentElement()).css('min-height', 0);
          thisViz.data = {};
          $.each(vizzesData, function(index, vizData) {
            if (vizData.url == thisVizUrl) {
              thisViz.data = vizData;
              return false;
            }
          });

          // If there was previously an active sheet for this viz, activate
          // that sheet again
          if (thisViz.data.activeSheet) {
            thisViz.getWorkbook().activateSheetAsync(thisViz.data.activeSheet);
          } else {
            thisViz.data.activeSheet = thisViz.getWorkbook().getActiveSheet().getName();
          }

          // On the first initialization of this sheet, mark the corresponding
          // button as active and update the title if dynamic
          if (!thisViz.data.initialized) {
            thisViz.data.initialized = true;

            if (multipleSheets) {
              var button = thisViz.data.$buttons.find('[data-sheet-name="' + thisViz.data.activeSheet + '"]');
              button.addClass('active');
            }

            if (thisViz.data.dynamic_title) {
              thisViz.data.$title.text(thisViz.data.title + ' — ' + thisViz.data.activeSheet);
            }
          }

          vizzes[thisVizUrl] = thisViz;
        };
        data.options = options;
        data.vizDOMElement = $viz.get(0);
        data.$interactiveWrapper = $interactiveWrapper;
        data.$title = $title;
        renderViz(data);
      });
    }

    // Manage responsive behavior for already initialized vizzes
    enquire.register("screen and (max-width: 767px)", {
      match : function() {
        reRenderAllVizzes('phone');
      },
      unmatch : function() {
        reRenderAllVizzes('desktop');
      }
    });

    function reRenderAllVizzes(device) {
      $.each(vizzes, function(vizUrl, vizObj) {
        $.each(vizzesData, function(index, vizData) {
          if (vizData.url == vizUrl) {
            vizData.options.device = device;
            renderViz(vizData, vizObj);
            return false;
          }
        });
      });
    }

    function renderViz(vizData, oldViz) {
      // Delete old viz if present
      if (oldViz) {
        $(vizData.vizDOMElement).css('min-height', $(vizData.vizDOMElement).height() + 'px');
        oldViz.dispose();
      }

      // Collect options
      var allOptions = $.extend(true, {}, baseVizOptions);
      for (var prop in vizData.options) {
        if (vizData.options.hasOwnProperty(prop)) {
          allOptions[prop] = vizData.options[prop];
        }
      }

      // Re-render the viz
      new tableau.Viz(vizData.vizDOMElement, vizData.url, allOptions);
    }
  });
})(jQuery);
