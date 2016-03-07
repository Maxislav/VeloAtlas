System.register(['angular2/core', "angular2-local-storage/local_storage", "./service.menu"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, local_storage_1, service_menu_1;
    var MymapEvents;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (local_storage_1_1) {
                local_storage_1 = local_storage_1_1;
            },
            function (service_menu_1_1) {
                service_menu_1 = service_menu_1_1;
            }],
        execute: function() {
            MymapEvents = (function () {
                function MymapEvents(serviceMenu) {
                    this.serviceMenu = serviceMenu;
                    this.localStorage = new local_storage_1.LocalStorage();
                }
                MymapEvents.prototype.init = function (map) {
                    function setLatLng(e) {
                        this.mouseLng = e.latlng.lat.toFixed(6);
                        this.mouseLat = e.latlng.lng.toFixed(6);
                    }
                    map.on('mousemove', setLatLng.bind(this));
                    function getCenter() {
                        this.mapLat = map.getCenter().lat.toFixed(6);
                        this.mapLng = map.getCenter().lng.toFixed(6);
                        this.localStorage.set('mapLat', this.mapLat);
                        this.localStorage.set('mapLng', this.mapLng);
                    }
                    getCenter.call(this);
                    map.on('moveend', getCenter.bind(this));
                    function setZoomToStarage() {
                        this.mapZoom = map.getZoom();
                        this.localStorage.set('mapZoom', this.mapZoom);
                    }
                    map.on('zoomend', setZoomToStarage.bind(this));
                    function hideMenu() {
                        this.serviceMenu.show = false;
                    }
                    map.on('click', hideMenu.bind(this));
                };
                MymapEvents = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [service_menu_1.ServiceMenu])
                ], MymapEvents);
                return MymapEvents;
            })();
            exports_1("MymapEvents", MymapEvents);
        }
    }
});
//# sourceMappingURL=service.map.events.js.map