import {inject, TestBed} from "@angular/core/testing";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {Observable} from "rxjs";
import {HttpModule, RequestMethod, Response, ResponseOptions, XHRBackend} from "@angular/http";

import {DashboardService} from "./dashboard.service";
import {ConfigService} from "../config/config.service";
import {ConfigServiceMock} from "../shared/test/stub/config.service";
import {UserService} from "../users/user.service";
import {Dashboard} from "./dashboard.model";

describe('Service: DashboardService', () => {
    let mockBackend, service: DashboardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                DashboardService,
                UserService,
                {provide: XHRBackend, useClass: MockBackend},
                {provide: ConfigService, useClass: ConfigServiceMock}
            ]
        })
    });

    beforeEach(inject([DashboardService, XHRBackend], (_service, _mockBackend) => {
        service = _service;
        mockBackend = _mockBackend;
    }));

    it('.createDefaultDashboard() - should create a new default dashboard', () => {
        spyOn(service, 'createResource').and.returnValue(Observable.of(<Dashboard>{name: 'name', icon: 'icon'}));
        service.createDefaultDashboard()
            .subscribe((res) => expect(res).toEqual(jasmine.objectContaining({name: 'name', icon: 'icon'})));
    });

    it('.createDefaultDashboard() - should get an error during creating the default dashboard', () => {
        let error: Error = new Error('the dashboards was not created');
        spyOn(service, 'createResource').and.returnValue(Observable.create(obs => obs.error(error)));
        service.createDefaultDashboard().subscribe(null,
            (e) => expect(e.message).toEqual(error.message)
        );
    });

    it('.getDefaultDashboard() - should retrieve a default dashboard', () => {
        mockBackend.connections.subscribe((c: MockConnection) => {
            expect(c.request.method).toEqual(RequestMethod.Get);
            let response = new ResponseOptions({body: {_embedded: {dashboards: [{}]}}});
            c.mockRespond(new Response(response));
        });
        service.getDefaultDashboard().subscribe();
    });

    it('.getDefaultDashboard() - should get an error while retrieving the default dashboard', () => {
        mockBackend.connections.subscribe(connection => connection.mockError(new Error('error')));
        service.getDefaultDashboard().subscribe(null,
            (e) => expect(e.message).toEqual('error')
        );
    });
});