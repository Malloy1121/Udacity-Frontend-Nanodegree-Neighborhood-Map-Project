$(document).ready(function () {
    var param = {
        radius: 1000 * 1.61,
        categoryId: "4d4b7105d754a06374d81259",
        client_id: "55QPL3HEO4XFTMP1MVZ5A3HGFRFNRIVUCOEGIX12WTQNL5IZ",
        client_secret: "THU4ZK5SXWQCSLPPJUHJK5RAXH5S4F5E1JGSHVC0YMQABUJC",
        ll: "40.7,-74",
        limit: 20
        // v:version
    };

    var param_photo = {
        client_id: "55QPL3HEO4XFTMP1MVZ5A3HGFRFNRIVUCOEGIX12WTQNL5IZ",
        client_secret: "THU4ZK5SXWQCSLPPJUHJK5RAXH5S4F5E1JGSHVC0YMQABUJC",
        limit: 1
        // v:"version"
    };

    $.explore = function (ll) {
        var date = new Date();
        var version = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString();
        // console.log(date.getFullYear(),date.getMonth()+1,date.getDate(),version);
        param.ll=ll;
        param.v = version;
        console.log(param);
        $.ajax({
            url: "https://api.foursquare.com/v2/venues/explore",
            dataType: "jsonp",
            type: "get",
            data: param,
            success: function (data) {
                // console.log(data.response.groups[0].items);
                var items = data.response.groups[0].items;
                items.forEach(function (each) {
                    var id = each.venue.id;
                    getPhoto(each, id, version);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    };

    var getPhoto = function (venue, id, version) {
        var date = new Date();
        param_photo.v = version;
        $.ajax({
            url: "https://api.foursquare.com/v2/venues/" + id + "/photos",
            dataType: "jsonp",
            type: "get",
            data: param_photo,
            success: function (data) {
                if (data.response.photos.count == 0)
                    return;
                var item = data.response.photos.items[0];
                // console.log(data);
                venue.photo = item.prefix + "390x200" + item.suffix;
                createItem(venue);
                // console.log(venue);
            },
            error: function (data) {
                console.log(data);
            }
        });
    };

    function createItem(item){
        var food=new Food();
        var venue=item.venue;
        food.photo=item.photo;
        food.name=venue.name;
        food.category=venue.categories[0].shortName;
        if(food.rating) {
            food.rating = venue.rating;
            food.ratingColor="#"+venue.ratingColor;
        }
        if(venue.hours)
        food.hours=venue.hours.status;
        food.address=venue.location.address+", "+venue.location.city;
        var price="";
        for(var i=0;i<venue.price.tier;i++) {
            price += "$";
        }
        food.price=price;
        vm.nearby.push(food);
    }

    // $.explore("");

});