export interface MovieDBUserResultData {
  data: {
    moviedbusers: [{
      username: string;
      email: string;
      pw: string;
    }]
  };
  loading: boolean;
  networkStatus: number;
  stale: boolean;
}
