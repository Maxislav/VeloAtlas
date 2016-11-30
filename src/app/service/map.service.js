"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by maxislav on 20.10.16.
 */
var core_1 = require('@angular/core');
var local_storage_service_1 = require('../service/local-storage.service');
var MapService = (function () {
    // public ls: LocalStorage
    //private ref: ApplicationRef
    function MapService(ref, ls) {
        this.ref = ref;
        this.ls = ls;
        this.events = {
            load: []
        };
        // this.ref = ref;
        //this.emitter = new EventEmitter()
    }
    MapService.prototype.setMap = function (map) {
        var _this = this;
        this.map = map;
        map.on('load', function () {
            _this.pitch = map.getPitch().toFixed(0);
            _this.bearing = map.getBearing().toFixed(1);
            _this.zoom = map.getZoom().toFixed(1);
            var LngLat = map.getCenter();
            _this.lngMap = LngLat.lng.toFixed(4);
            _this.latMap = LngLat.lat.toFixed(4);
            _this.ref.tick();
        });
        map.on('mousemove', function (e) {
            _this.lat = e.lngLat.lat.toFixed(4);
            _this.lng = e.lngLat.lng.toFixed(4);
        });
        map.on('move', function (e) {
            //console.log()
            _this.pitch = map.getPitch().toFixed(0);
            _this.bearing = map.getBearing().toFixed(1);
            _this.zoom = map.getZoom().toFixed(1);
            var LngLat = map.getCenter();
            _this.lngMap = LngLat.lng.toFixed(4);
            _this.latMap = LngLat.lat.toFixed(4);
        });
        map.on('moveend', function () {
            var LngLat = map.getCenter();
            var opt = {
                lng: LngLat.lng,
                lat: LngLat.lat,
                zoom: map.getZoom()
            };
            _this.ls.mapCenter = opt;
        });
    };
    MapService.prototype.registerEvent = function (name, f) {
        //console.log(this.events)
        // debugger
        this.events[name] = this.events[name] || [];
        this.events[name].push(f);
    };
    MapService.prototype.registerChanges = function (foo) {
        this.foo = foo;
    };
    MapService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.ApplicationRef, local_storage_service_1.LocalStorage])
    ], MapService);
    return MapService;
}());
exports.MapService = MapService;