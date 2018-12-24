import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeroDetailComponent} from './hero-detail.component';
import {ActivatedRoute} from '@angular/router';
import {HeroService} from '../hero.service';
import {Location} from '@angular/common';
import {of} from 'rxjs/internal/observable/of';
import {FormsModule} from '@angular/forms';

describe('HeroDetailComponent', () => {
    let fixture: ComponentFixture<HeroDetailComponent>;
    let mockActivatedRoute, mockHeroService, mockLocation;

    // no matter what you're doing you shouldn't test the framework.
    // For that reason, when we're dealing with routing and tests, we're not going to actually let our code route.
    // We know that Angular's router works, so we're not going to try to actually do routing,
    // instead we're just going to test how we interact with the routing components.
    beforeEach(() => {
        mockActivatedRoute = {
            snapshot: { paramMap: { get: () => { return '3'; }}}
        };
        mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
        mockLocation = jasmine.createSpyObj(['back']);

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [HeroDetailComponent],
            providers: [
                {provide: ActivatedRoute, useValue: mockActivatedRoute},
                {provide: HeroService, useValue: mockHeroService},
                {provide: Location, useValue: mockLocation}
            ]
        });

        fixture = TestBed.createComponent(HeroDetailComponent);

        mockHeroService.getHero.and.returnValue(of({id: 3, name: 'SuperDude', strength: 100}));
    });

    it('should render hero name in a h2 tag', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE');
    });
});

