const stack = $state<string[]>([]);

export const pushModal = (id: string) => {
	if (!stack.includes(id)) stack.push(id);
};

export const popModal = (id: string) => {
	const index = stack.indexOf(id);
	if (index !== -1) stack.splice(index, 1);
};

export const isTopModal = (id: string) => stack.at(-1) === id;
