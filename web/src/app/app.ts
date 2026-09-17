import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiStatus } from './components/api-status/api-status';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ApiStatus],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
