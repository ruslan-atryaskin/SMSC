import {Component, Input, ModuleWithProviders, NgModule, Output, EventEmitter} from "@angular/core";
import {TranslateService, TranslateModule} from "ng2-translate/ng2-translate";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {Location, CommonModule} from "@angular/common";
import {CrudService} from "../../crud.service";
import {FormsModule} from "@angular/forms";
import {MultipleSelectService} from "./multiple-select.service";
import {NotificationService} from "../../../services/notification-service";
import {CommonService} from "../../../services/common";
import {Link} from "../../entity.model";
import {Http, RequestOptions, RequestMethod} from "@angular/http";
import {OneToMany, Action} from "./one-to-many.model";

@Component({
    selector: 'one-to-many',
    templateUrl: './one-to-many.component.html',
    styleUrls: ['one-to-many.component.scss']
})
export class OneToManyComponent {

    @Input('mainEntityId')
    public id: number;

    @Input('renderProperties')
    public renderProperties: string[] = [];

    @Input('property')
    public property: string = '';

    @Input('link')
    public link: Link;

    @Output('onBack')
    public _onBack: EventEmitter<OneToMany> = new EventEmitter();

    @Output('onCreate')
    public _onCreate: EventEmitter<OneToMany> = new EventEmitter();

    @Output('onUpdate')
    public _onUpdate: EventEmitter<OneToMany> = new EventEmitter();

    @Output('onDelete')
    public _onDelete: EventEmitter<OneToMany> = new EventEmitter();

    public resources = [];

    public pathFromRoot: string;

    constructor(public translate: TranslateService,
                public route: ActivatedRoute,
                public router: Router,
                public location: Location,
                public notifications: NotificationService,
                public commonService: CommonService,
                public http: Http) {
    }

    ngOnInit() {
        this.pathFromRoot = this.commonService.getPathFromRoot(this.route.parent.pathFromRoot);

        this.getResources(this.link)
            .subscribe(resources => {
                this.resources = resources[Object.keys(resources)[0]];
            });
    }

    onBack() {
        this._onBack.emit(new OneToMany(this.property, Action.View));
    }

    onCreate() {
        this._onCreate.emit(new OneToMany(this.property, Action.Create));
    }

    onUpdate(entity) {
        this._onUpdate.emit(new OneToMany(this.property, Action.Update, entity));
    }

    onDelete(entity) {
        this._onDelete.emit(new OneToMany(this.property, Action.Delete, entity));
    }

    /**
     * Retrieves a list of resources by link
     * @param link
     * @returns {Observable<T>}
     */
    getResources(link: Link) {
        let requestOptions = new RequestOptions({
            method: RequestMethod.Get,
        });

        return this.http.request(link.href, requestOptions)
            .map(res => res.json()['_embedded'])
            .share();
    }
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        RouterModule
    ],
    exports: [OneToManyComponent],
    declarations: [OneToManyComponent]
})
export class OneToManyModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: OneToManyModule,
            providers: []
        };
    }
}