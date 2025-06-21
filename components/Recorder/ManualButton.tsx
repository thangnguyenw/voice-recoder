import { useState } from 'react';

interface ManualButtonProps {
  buttonState: 'off' | 'on' | 'transitioning-on' | 'transitioning-off';
  setButtonState: (state: ManualButtonProps['buttonState']) => void;
}

export default function ManualButton({ buttonState, setButtonState }: ManualButtonProps) {
  const handleClick = () => {
    if (buttonState === 'off') {
      setButtonState('transitioning-on');
      setTimeout(() => {
        requestAnimationFrame(() => setButtonState('on'));
      }, 2600); // delay thêm chút tránh nháy
    } else if (buttonState === 'on') {
      setButtonState('transitioning-off');
      setTimeout(() => {
        requestAnimationFrame(() => setButtonState('off'));
      }, 2600);
    }
  };

  const getImageSrc = () => {
    switch (buttonState) {
      case 'transitioning-on':
        return '/gifs/off-on.gif';
      case 'transitioning-off':
        return '/gifs/on-off.gif';
      case 'on':
        return '/images/on.png';
      case 'off':
      default:
        return '/images/off.png';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-60">
      <button
        onClick={handleClick}
        disabled={buttonState.startsWith('transitioning')}
        className="bg-gray-200 hover:bg-gray-300 w-48 h-48 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
      >
        <img
          src={getImageSrc()}
          alt="Nút điều khiển"
          key={buttonState} // Force re-render to avoid image caching/glitch
          className={`w-full h-full object-contain rounded-full transition-opacity duration-300`}
        />
      </button>
      <p className="mt-4 text-gray-600 text-sm">
        {buttonState === 'on'
          ? 'Đang hoạt động'
          : buttonState === 'off'
          ? 'Sẵn sàng để bật'
          : 'Đang chuyển trạng thái...'}
      </p>
    </div>
  );
}
