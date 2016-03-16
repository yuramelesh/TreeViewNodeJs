/**
 * Created by incognito on 11.03.16.
 */

document.addEventListener("DOMContentLoaded", loadData);

function loadData() {

    $.ajax({
        type: "POST",
        url: "/getData",
        success: function (data) {

            drawMenu(data);

            var delElem = document.getElementById('deleteList');
            var addElem = document.getElementById('addParent');
            var editElem = document.getElementById('editList');
            var parentElem = document.getElementById('editParent');

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

function drawMenu(data) {

    $('#add-form').css("display", "none");
    $('#delete-form').css("display", "none");
    $('#edit-form').css("display", "none");

    if (document.getElementById('main').hasChildNodes() === true) {
        document.getElementById('main').innerHTML = '';
    }

    var menu = document.createElement('ul');
    menu.id = 'mainUl';
    document.getElementById('main').appendChild(menu);
    var mainCounter = 0;
    data.forEach(function (mainCompanyItem) {

        mainCounter += mainCompanyItem.earnings;

        if (mainCompanyItem.parent === 0) {

            var mainItemElement = document.createElement('li');
            mainItemElement.id = mainCompanyItem.id;
            mainItemElement.className = 'item';
            var div1 = document.createElement('div');
            div1.innerHTML = mainCompanyItem.name;
            var spanEarnings = document.createElement('span');
            spanEarnings.innerHTML = ' | ' + mainCompanyItem.earnings;
            spanEarnings.style.background = '#c5cae9';
            div1.appendChild(spanEarnings);
            div1.className = 'selection';
            div1.id = 'div' + mainItemElement.id;
            mainItemElement.appendChild(div1);
            menu.appendChild(mainItemElement);

            drawSubMenu(mainCompanyItem, mainItemElement);

            if (mainCompanyItem.earnings != mainCounter) {
                var s = document.createElement('span');
                s.id = 'summ' + mainCompanyItem.id;
                s.innerHTML = ' | ' + mainCounter;
                s.style.background = '#7986cb';
                div1.appendChild(s);
               // div1.insertBefore(s, mainItemElement.children[2]);
            }
        }
        mainCounter = 0;
    });


    function drawSubMenu(parentCompany, parentCompanyElement) {

        var subCounter = parentCompany.earnings;

        data.forEach(function (currentCompany) {

            if (currentCompany.parent === parentCompany.id) {

                mainCounter += currentCompany.earnings;

                var subUl = document.createElement('ul');
                var subli = document.createElement('li');
                subli.id = currentCompany.id;
                subli.className = 'item';
                var div2 = document.createElement('div');
                div2.innerHTML = currentCompany.name;
                var spanEarnings1 = document.createElement('span');
                spanEarnings1.innerHTML = ' | ' + currentCompany.earnings;
                spanEarnings1.style.background = '#c5cae9';
                var spanSumm1 = document.createElement('span');
                spanSumm1.innerHTML = '';
                spanSumm1.id = 'summ' + currentCompany.id;
                subli.appendChild(div2);
                div2.className = 'selection';
                div2.id = 'div' + currentCompany.id;
                div2.appendChild(spanEarnings1);
                div2.appendChild(spanSumm1);
                subUl.appendChild(subli);
                parentCompanyElement.appendChild(subUl);
                subCounter += drawSubMenu(currentCompany, subli);
                var f = document.getElementById('summ' + parentCompany.id);

                if (f !== null) {
                    f.innerHTML = ' | ' + subCounter;
                    f.style.background = '#7986cb';
                }
            }
        });

        return subCounter;
    }

    return menu;
}

$(function () {
    $('#show_link').click(function () {
        $.ajax({
            url: "/getData",
            type: "POST",
            success: function (data) {
                drawMenu(data);
                console.log('success')

            },
            error: function () {
                console.log('error!!!')
            }
        });
    })
});


$(function () {
    $('#delete').submit(function () {
        var data = $('#delete').serialize();
        $.ajax({
            url: '/remove',
            type: 'POST',
            data: data,
            success: function () {
                loadData();
            }
        });
    });
});

$(function () {
    $('#adding').submit(function () {
        var data = $('#adding').serialize();
        //console.log(data);
        //var d = data.toJSON();
        //console.log(d);
        $.ajax({
            url: '/add',
            type: 'POST',
            data: data,
            success: function () {
                loadData();
            }
        });
    });
});

$(function () {
    $('#edit').submit(function () {
        var data = $('#edit').serialize();
        $.ajax({
            url: '/update',
            type: 'POST',
            data: data,
            success: function () {
                loadData();
            }
        });
    });
});
