import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeCabecera } from '../home-cabecera/home-cabecera';
import { GamesEa } from '../games-ea/games-ea';
import { XboxExclusivesComponent } from '../xbox-exclusives/xbox-exclusives';
import { LocalCoopGamesComponent } from "../local-coop-games/local-coop-games";
import { HaloSaga } from "../halo-saga/halo-saga";
import { Footer } from '../../../components/footer/footer';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HomeCabecera, GamesEa, XboxExclusivesComponent, LocalCoopGamesComponent, HaloSaga],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}