import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeroesComponent} from './heroes.component';
import {Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output} from '@angular/core';
import {HeroService} from '../hero.service';
import {of} from 'rxjs';
import {Hero} from '../hero';
import {By} from '@angular/platform-browser';
import {HeroComponent} from '../hero/hero.component';

describe('HeroesComponent (deep tests)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach(() => {
        HEROES = [
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'Wonderful Woman', strength: 24},
            {id: 3, name: 'SuperDude', strength: 55},
        ];
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent
            ],
            providers: [
                {provide: HeroService, useValue: mockHeroService}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should render each hero as a HeroComponent', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        // We'll call fixture. detectChanges, and of course this fixture only points at the HeroesComponent, not the child HeroComponent,
        // but because we have called change detection on the parent component, change detection will then run on all child components.
        // So not only will the parent component get initialized, but all child components will get initialized.
        // run ngOnInit
        fixture.detectChanges();

        // In Angular a component is actually a subclass of a directive. It's a more specialized kind of directive.
        // We normally think of directives as being an attribute, such as routerLink, and components as being an element,
        // such as what we have here, the app-hero is an element,
        // but in the inner workings of Angular a directive is actually the parent class for both attribute directives
        // and components, such as our HeroComponent here.
        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentDEs.length).toEqual(3);
        // expect(heroComponentDEs[0].componentInstance.hero.name).toEqual('SpiderDude');
        // expect(heroComponentDEs[1].componentInstance.hero.name).toEqual('Wonderful Woman');
        // expect(heroComponentDEs[2].componentInstance.hero.name).toEqual('SuperDude');
        for (let i = 0; i < heroComponentDEs.length; i++) {
            expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    });

});
