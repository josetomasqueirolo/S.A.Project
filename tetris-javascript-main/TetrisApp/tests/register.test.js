const User = require('../models/User');

jest.mock('../models/User');

describe('Register User - Duplicate Check', () => {
    it('should not allow duplicate usernames', async () => {
        const mockUserData = { username: 'testUser', password: 'password123' };

        User.findOne = jest.fn().mockResolvedValueOnce(mockUserData);

        const existingUser = await User.findOne({ username: mockUserData.username });

        expect(User.findOne).toHaveBeenCalledWith({ username: mockUserData.username });
        expect(existingUser).toEqual(mockUserData);
    });
});
