import { TestBed } from '@angular/core/testing';

import { GET_MOVIE_LIST_QUERY, ListService } from './list.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { Apollo } from 'apollo-angular';

describe('ListService', () => {
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ApolloTestingModule
      ],
      providers: [
        Apollo
      ]
    });

    controller = TestBed.get(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    const service: ListService = TestBed.get(ListService);
    expect(service).toBeTruthy();
  });

  it('receives movie list from database', () => {
    const service: ListService = TestBed.get(ListService);

    service.getMovieList().subscribe((result) => {
      expect(result.data.moviedblists.id).toEqual('123');
      expect(result.data.moviedblists.username).toEqual('Tester');
      expect(result.data.moviedblists.movieId).toEqual(1234);
      expect(result.data.moviedblists.title).toEqual('Fight Club');
      expect(result.data.moviedblists.releaseDate).toEqual('1999');
      expect(result.data.moviedblists.posterPath).toEqual('/posters/poster.png');
    });

    const op = controller.expectOne(GET_MOVIE_LIST_QUERY);

    // Respond with mock data, causing observable to resolve
    op.flush({
      data : {
        moviedblists: {
          id: '123',
          username: 'Tester',
          movieId: 1234,
          title: 'Fight Club',
          releaseDate: '1999',
          posterPath: '/posters/poster.png'
        }
      }
    });

    // Finally, assert that there are no outstanding operations.
    controller.verify();
  });
});
