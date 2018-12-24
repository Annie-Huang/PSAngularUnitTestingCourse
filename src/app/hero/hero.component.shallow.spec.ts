import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeroComponent} from './hero.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('HeroComponent (shallow tests)', () => {
    let fixture: ComponentFixture<HeroComponent>;

    // [NO_ERRORS_SCHEMA] --  This special setting will tell Angular that for this module do not error
    // if you encounter an unknown attribute or an unknown element in your HTML of the template, just ignore it.
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroComponent);
    });

    it('should have the correct hero', () => {
        fixture.componentInstance.hero = {id: 1, name: 'SuperDude', strength: 3};

        expect(fixture.componentInstance.hero.name).toEqual('SuperDude');
    });

    it('should render the hero name in an anchor tag', () => {
        fixture.componentInstance.hero = {id: 1, name: 'SuperDude', strength: 3};
        fixture.detectChanges();

        // And again, a debugElement is a wrapper around the actual DOM node.
        // Similar to the way that the fixture is a wrapper around a component,
        // a debugElement is a wrapper around a DOM node.
        // Note:
        // We will only be interested in query or queryAll or componentInstance
        //       Generally, if we want to handle to a component we just ask the fixture for the componentInstance,
        //       but sometimes if we're working with multiple components we need to know the component that
        //       a given element belongs to. And so that's another scenario where the debugElement comes in handy.
        // Use the By from @angular/platform-browser, not from protractor or selenium-driver
        // We will only be interested in By.directive and By.css
        const deA = fixture.debugElement.query(By.css('a'));    // deA -> debugElement around the Anchor tag
        expect(deA.nativeElement.textContent).toContain('SuperDude');

        expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude');
    });
});
