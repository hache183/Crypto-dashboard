export default function WatchlistButton({ coinId, isInWatchlist, onToggle }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onToggle(coinId);
  };

  return (
    <button
      onClick={handleClick}
      className={`text-xl transition-all ${
        isInWatchlist 
          ? 'text-yellow-400 hover:text-yellow-500' 
          : 'text-gray-600 hover:text-yellow-400'
      }`}
      title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {isInWatchlist ? '⭐' : '☆'}
    </button>
  );
}