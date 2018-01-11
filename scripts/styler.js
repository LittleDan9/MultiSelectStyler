/*
The MIT License (MIT)

Copyright (c) 2015 Daniel R. Little

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

$(function () {
    //Load the styler for all multiselectes
    styleMultiSelects();
});

//Proof that the styled list modifies the select
$('#btnSubmit').on('click', function(e){
	var result = '';
    $('select[multiple="multiple"]').each(function () {        
        result += $(this).attr('id') + ':<br/>';
        $(this).find('option:selected').each(function(){
            result += '&nbsp&nbsp' + $(this).text() + ' - ' + $(this).val() + '<br/>';
        });
        
    });
    $('#divResults').html(result);
});
/*
Title: Multi-Select to Check Box List
Author: Dan Little
Date: 2015-04-14
Purpose: This function will identify select boxes that are created using the ListBoxFor MVC handler. This select box will then be hidden and the a interactive unordered list will be displayed. When a list item is clicked, the item will toggle state from checked or unchecked and the corresponding option's selected state will be updated. The corresponding styles for this can be found in the .less file under listbox-well. Toggleing the orderListItemAtoZ will order the options in the select by the US Alphabet.
*/
function styleMultiSelects() {
    orderListItemsAtoZ = true;
    $('select[multiple="multiple"]').each(function () {
        //Create variable for the select box
        var $selectBox = $(this);
        if ($selectBox.data('styled')) return;

        $selectBox.data('styled', true);
        //Hide the Select Box
        $selectBox.addClass("hidden");
        //Unique ID for div that wraps the list items
        var divID = $selectBox.attr("id") + "Div";
        //Inject the div after the select box
        $selectBox.after('<div id="' + divID + '" class="well listbox-well">');

        //create variable for the wrapper div
        var $divList = $('#' + divID); 
        loadItems($divList, $selectBox);
    });
}

function loadItems($divList, $selectBox) {
    $divList.html("");
    //create the ul for the check box list items
    $divList.append('<ul>');
    loadListItems($selectBox.children('option'), $divList, $selectBox);
}

function loadListItems($items, $divList, $selectBox){
	//Some custom classes that are used to style the list items.
    //Applied to the list items element
    var uncheckedClass = 'btn-default';
    var checkedClass = 'btn-primary';
    //Applied to the span tag in the list item HTML
    var uncheckedGlyph = 'glyphicon-unchecked';
    var checkGlyph = 'glyphicon-check';
    
    if(orderListItemsAtoZ){
        $items = $items.sort(function (optionA, optionB) {
        	var text1 = $.trim($(optionA).text()).toLowerCase(),
				text2 = $.trim($(optionB).text().toLowerCase());
        	return text1 > text2 ? 1 : text1 < text2 ? -1 : 0;
    	});
    }
    
    $items.each(function() {
        //Variable to reference option element
        $option = $(this);
        //Determine what glyphicon to put on.
        glyph = $option.is(':selected') ? checkGlyph : uncheckedGlyph;
        //create a list item
        li = $('<li class="btn ' + uncheckedClass + '" data-value="' + $option.val() + '">');
        //Add glyphicon & option text to list item
        li.html('<span class="state-icon glyphicon ' + glyph + '"></span>' + $option.html());

        //Because the default for the li style is btn-default, only if the option is selected, we want to toggle it to the btn-color
        if ($option.is(':selected')) 
            li.toggleClass(uncheckedClass + ' ' + checkedClass);
        
        //Add the list item to the ul element.
        $divList.children('ul').append(li); 

        //Setup the on click event
        li.on('click', function () {
            //Find the span tag in the li and toggle it
            $(this).children('span').first().toggleClass(checkGlyph + ' ' + uncheckedGlyph);
            //Toggle the li class to checked or unchecked.
            $(this).toggleClass(uncheckedClass + ' ' + checkedClass);
            //Update the original select form controls values.            
            updateSelect($selectBox, $(this).attr('data-value'));
            //if using jQuery.Validate
            //$option.closest('form').validate().element($selectBox);
            var value = $(this).attr("data-value");
        });
    });
}

function updateSelect($selectBox, value) {
    var optionValues = new Array();
    //Create and Array of the selected items values.
    $selectBox.children('option:selected').each(function () {
        optionValues[optionValues.length] = $(this).val();
    });
    //Is the value that we clicked selected in the multiselect box?
    if (optionValues.indexOf(value) != -1){
        //Remove it from the selected values
        optionValues = jQuery.grep(optionValues, function (newArray) {
            return newArray != value;
        });
    }else{
        // Add it to the selected values
        optionValues[optionValues.length] = value;
    }
    //Update the select box
    $selectBox.val(optionValues);
}