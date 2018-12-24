import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeroesComponent} from './heroes.component';
import {Component, Directive, EventEmitter, Input, NO_ERRORS_SCHEMA, Output} from '@angular/core';
import {HeroService} from '../hero.service';
import {of} from 'rxjs';
import {Hero} from '../hero';
import {By} from '@angular/platform-browser';
import {HeroComponent} from '../hero/hero.component';

// This code is from the angular official document suggestion on how to test routerLink
@Directive({
    selector: '[routerLink]',
    host: {'(click)': 'onClick()'}
})
export class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}


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
                HeroComponent,
                RouterLinkDirectiveStub
            ],
            providers: [
                {provide: HeroService, useValue: mockHeroService}
            ],
            // schemas: [NO_ERRORS_SCHEMA]  // Because hero.component.html has a routerLink in it.
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

    // It is subjective whether you want to test this. If your child component have sufficient test and the parent component
    // also has sufficient test. Then the deep test for parent can just test binding between parent and child.
    it(`should call heroService.deleteHero when the Hero Component's delete button is clicked`, () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();

        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        // // Method 1.
        // heroComponents[0].query(By.css('button'))
        //     .triggerEventHandler('click', {stopPropagation: () => {}});
        // // Method 2.
        // (<HeroComponent> heroComponents[0].componentInstance).delete.emit(undefined);
        // Method 3.
        heroComponents[0].triggerEventHandler('delete', null);  // null and undefined not really matters.


        // // This will failed because it's not trigger focus event, just show what event you can triggered
        // heroComponents[0].query(By.css('button'))
        //     .triggerEventHandler('focus', {stopPropagation: () => {}});
        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
    });

    it('should add a new hero to the hero list when the add button is clicked', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const name = 'Mr. Ice';
        mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

        inputElement.value = name;
        addButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
        expect(heroText).toContain(name);
    });

    it('should have the correct route for the first hero', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

        const routerLink = heroComponents[0]
            .query(By.directive(RouterLinkDirectiveStub))
            .injector.get(RouterLinkDirectiveStub);

        heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

        expect(routerLink.navigatedTo).toBe('/detail/1');
    });
});
