'use strict';
$(function() {
  var filters = $('.dropdown[data-filter-by]');
  var itemNodes = document.getElementsByClassName('list-item');
  var whenNothingToShow = document.getElementById('list-item-like');
  var currentlyFilteredBy = [];
  var items = [];
  // create an array for object with items to sort
  Array.prototype.slice.call(itemNodes).forEach(function(node) {
    items.push({
      node: node,
      sortedBy: JSON.parse(node.dataset.filterValues)
    });
  });
  var itemsTotal = items.length;

  // when selecting a new filter option
  filters.on('click', 'a[data-filter-by]', function(e) {
    e.preventDefault();
    // cache variables
    var target = $(e.target);
    var filterCat = e.target.parentNode.parentNode.parentNode.dataset.filterBy;
    var filterItem = e.target.dataset.filterBy;
    var parentFilter = target.parent().parent().prev().children().first();
    // remove previous filter item if exists
    for (var length = currentlyFilteredBy.length, index = 0; index < length; index++) {
      var itemFilter = currentlyFilteredBy[index];
      var filterCatRegExp = new RegExp('^' + filterCat, 'g');
      if (itemFilter.match(filterCatRegExp) !== null) {
        currentlyFilteredBy.splice(index, 1);
        break;
      }
    }

    // is it empty filter param or add new filter criteria
    if (filterItem === 'all') {
      // change filter dropdown text to default
      parentFilter.text(parentFilter[0].dataset.defaultText);
    } else {
      parentFilter.text(target.text()); // change text on the filter button
      currentlyFilteredBy.push(filterCat + '-' + filterItem); // add new filter to currently filtered by
    }

    var newCurrentFilerLength = currentlyFilteredBy.length;

    // if no filters - show all items
    // else - check each item on having each filter criteria
    if (newCurrentFilerLength < 1) {

      items.forEach(function(itemObj) {
        itemObj.node.style.display = 'block';
      });

      whenNothingToShow.style.display = 'none';

    } else {

      var itemsHidden = 0;

      items.forEach(function(itemObj) {

        var showMe = false;

        // for loop that we can break from when needed
        for (var index = 0; index < newCurrentFilerLength; index++) {
          var filterCriteria = currentlyFilteredBy[index];
          // proceed checking items until all criterias are met
          // or hide item if at least one is not
          if (itemObj.sortedBy.indexOf(filterCriteria) >= 0) {
            showMe = true;
            continue;
          } else {
            showMe = false;
            break;
          }
        }

        // hide or show each item
        if (showMe === true) {
          itemObj.node.style.display = 'block';
        } else {
          itemObj.node.style.display = 'none';
          itemsHidden++;
        }
      });

      // if I hidden all items - reveal we got nothing
      // otherwise keep it hidden
      if (itemsHidden === itemsTotal) {
        whenNothingToShow.style.display = 'block';
      } else {
        whenNothingToShow.style.display = 'none';
      }
    };
  });
});