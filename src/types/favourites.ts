export interface FavouriteLocation {
  city: string;
  country: string;
}

export interface FavouritesState {
  items: FavouriteLocation[];
  showList: boolean;
}
