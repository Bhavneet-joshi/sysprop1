import fetch from 'node-fetch';

const users = [
  { email: 'admin@test.com', password: 'Qwerty@1234', role: 'admin' },
  { email: 'client@test.com', password: 'Qwerty@1234', role: 'client' },
  { email: 'employee@test.com', password: 'Qwerty@1234', role: 'employee' },
];

async function createUsers() {
  for (const user of users) {
    const response = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      console.log(`Successfully created user: ${user.email}`);
    } else {
      console.error(`Failed to create user: ${user.email}`);
      const error = await response.json();
      console.error(error);
    }
  }
}

createUsers();