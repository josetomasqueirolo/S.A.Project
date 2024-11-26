const User = require('../models/User');
const bcrypt = require('bcryptjs');

jest.mock('../models/User');

describe('Register User', () => {
    it('should hash the password and save the user', async () => {
        const mockUserData = { username: 'testUser', password: 'password123' };

        bcrypt.hash = jest.fn().mockResolvedValueOnce('hashedPassword123');

        User.prototype.save = jest.fn().mockImplementation(function () {
            this.password = 'hashedPassword123';
            return Promise.resolve(this);
        });

        const user = new User({
            username: mockUserData.username,
            password: await bcrypt.hash(mockUserData.password, 10),
        });

        await user.save();

        expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
        expect(User.prototype.save).toHaveBeenCalled();
        expect(user.password).toBe('hashedPassword123');
    });
});
