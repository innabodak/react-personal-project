import { MAIN_URL, TOKEN } from './config';

export const api = {
    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 200) {
            throw new Error('API data error');
        } else {
            const { data: tasks } = await response.json();

            return tasks;
        }
    },

    async createTask (message) {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        if (response.status !== 200) {
            throw new Error('API data error');
        } else {
            const { data: tasks } = await response.json();

            return tasks;
        }
    },

    async removeTask (id) {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            throw new Error('API data error');
        }
    },

    async updateTask (taskToUpdate) {
        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                'Content-type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify([taskToUpdate]),
        });

        if (response.status !== 200) {
            throw new Error('API data error');
        } else {
            const {
                data: [updatedTask],
            } = await response.json();

            return updatedTask;
        }
    },

    async completeAllTasks (tasksToComplete) {
        const response = await Promise.all(
            tasksToComplete.map((task) => this.updateTask(task))
        );

        if (response.status !== 200) {
            throw new Error('API data error');
        }
    },
};
