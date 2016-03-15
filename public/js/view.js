/**
 * Created by incognito on 11.03.16.
 */

document.addEventListener("DOMContentLoaded", loadData);

function loadData() {

    $.ajax({
        type: "GET",
        url: "/getData",
        success: function (data) {

            var delElem = document.getElementById('deleteList');
            var addElem = document.getElementById('addList');
            var editElem = document.getElementById('editList');
            var parentElem = document.getElementById('parentList');

            addOptions(delElem);
            addOptions(addElem);
            addOptions(editElem);
            addOptions(parentElem);

            function addOptions(elem) {
                data.forEach(function (s) {
                    var optionElement = document.createElement('option');
                    optionElement.value = s.id;
                    optionElement.innerHTML = s.name;
                    elem.appendChild(optionElement);
                });
            }
        }
    });
}

$(function () {
    $('#create_link').click(function () {
        $('#main').html(' ');
        $('#delete-form').css("display", "none");
        $('#add-form').css("display", "inherit");
        $('#edit-form').css("display", "none");

    })
});

$(function () {
    $('#edit_link').click(function () {
        $('#main').html(' ');
        $('#delete-form').css("display", "none");
        $('#add-form').css("display", "none");
        $('#edit-form').css("display", "inherit");
    })
});

$(function () {
    $('#remove_link').click(function () {
        $('#main').html(' ');
        $('#add-form').css("display", "none");
        $('#edit-form').css("display", "none");
        $('#delete-form').css("display", "inherit");


    })
});

$(function () {
    $('#show_link').click(function () {
        $.ajax({
            type: "GET",
            url: "/getData",
            success: function (data) {

                drawMenu(data);

            }
        });
    })
});

function drawMenu(data) {

    $('#add-form').css("display", "none");
    $('#delete-form').css("display", "none");
    $('#edit-form').css("display", "none");


    if (document.getElementById('main').hasChildNodes() === true) {
        document.getElementById('main').innerHTML = ' ';
    }

    var menu = document.createElement('ul');
    menu.id = 'mainUl';
    document.getElementById('main').appendChild(menu);
    var mainCounter = 0;
    data.forEach(function (mainCompanyItem) {

        mainCounter += mainCompanyItem.earnings;

        if (mainCompanyItem.parent === 0) {

            var mainItemElement = document.createElement('ul');
            mainItemElement.id = mainCompanyItem.id;
            mainItemElement.className = 'item';
            var spanName = document.createElement('span');
            spanName.innerHTML = mainCompanyItem.name;
            var spanEarnings = document.createElement('span');
            spanEarnings.innerHTML = ' - ' + mainCompanyItem.earnings;
            mainItemElement.appendChild(spanName);
            mainItemElement.appendChild(spanEarnings);

            menu.appendChild(mainItemElement);

            drawSubMenu(mainCompanyItem, mainItemElement);

            if (mainCompanyItem.earnings != mainCounter) {
                var s = document.createElement('span');
                s.id = 'summ' + mainCompanyItem.id;
                s.innerHTML = ' | ' + mainCounter;
                mainItemElement.insertBefore(s, mainItemElement.children[2]);
            }
        }
        mainCounter = 0;
    });


    function drawSubMenu(parentCompany, parentCompanyElement) {

        var subCounter = parentCompany.earnings;

        data.forEach(function (currentCompany) {

            if (currentCompany.parent === parentCompany.id) {

                mainCounter += currentCompany.earnings;
                var subli = document.createElement('ul');
                subli.id = currentCompany.id;
                subli.className = 'item';
                var spanName1 = document.createElement('span');
                spanName1.innerHTML = currentCompany.name;
                var spanEarnings1 = document.createElement('span');
                spanEarnings1.innerHTML = ' - ' + currentCompany.earnings;
                var spanSumm1 = document.createElement('span');
                spanSumm1.innerHTML = '';
                spanSumm1.id = 'summ' + currentCompany.id;
                subli.appendChild(spanName1);
                subli.appendChild(spanEarnings1);
                subli.appendChild(spanSumm1);
                parentCompanyElement.appendChild(subli);

                subCounter += drawSubMenu(currentCompany, subli);
                var f = document.getElementById('summ' + parentCompany.id);

                if (f !== null) {
                    f.innerHTML = ' | ' + subCounter;
                }
            }
        });

        return subCounter;
    }

    return menu;
}

$(function () {
    $('#adding').submit(function () {
        var data = $('#adding').serialize();
        $.ajax({
            type: 'get',
            url: '/add',
            data: data,
            success: function () {
                $('#main').html('');
                $('#main').text('New company was added!');
            },
            error: function (xhr, str) {
                //alert('Error: ' + xhr.responseCode);
            }
        });
    });
});

$(function () {
    $('#edit').submit(function () {
        var data = $('#edit').serialize();
        $.ajax({
            type: 'get',
            url: '/update',
            data: data,
            success: function () {
                $('#main').html('');
                $('#main').text('Company information was updated!');
            },
            error: function (xhr, str) {
                //alert('Error: ' + xhr.responseCode);
            }
        });
    });
});

$(function () {
    $('#delete').submit(function () {
        var data = $('#delete').serialize();
        $.ajax({
            type: 'get',
            url: '/remove',
            data: data,
            success: function () {

            },
            error: function (xhr, str) {
                //alert('Error: ' + xhr.responseCode);
            }
        });
    });
});

//function monitor(){
//    var sel = document.getElementById('deleteList');
//    var s = sel.value;
//    console.log(s);
//}