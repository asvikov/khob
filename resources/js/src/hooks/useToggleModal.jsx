import { useState } from 'react';

const useToggleModal = () => {
	const [isShowing, setIsShowing] = useState(false);

	function toggle() {
		setIsShowing(!isShowing);
	}

	return [
		isShowing,
		toggle
	];
}

export default useToggleModal;
