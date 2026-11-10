/**
 * In-memory Mock Data Store for Unit & Integration Testing
 */
class InMemoryDb {
    constructor() {
        this.users = new Map();
        this.hotels = new Map();
        this.rooms = new Map();
        this.bookings = new Map();
    }

    clear() {
        this.users.clear();
        this.hotels.clear();
        this.rooms.clear();
        this.bookings.clear();
    }
}

export const inMemoryDb = new InMemoryDb();

/**
 * Creates a chainable query helper mimicking Mongoose queries
 */
const createQuery = (result) => {
    const promise = Promise.resolve(result);
    promise.populate = () => createQuery(result);
    promise.sort = () => createQuery(result);
    promise.select = () => createQuery(result);
    promise.limit = () => createQuery(result);
    return promise;
};

export const createMockUserModel = () => ({
    findById: (id) => {
        const u = inMemoryDb.users.get(String(id));
        if (!u) return createQuery(null);
        return createQuery({
            ...u,
            save: async function () {
                inMemoryDb.users.set(String(this._id), this);
                return this;
            }
        });
    },
    findOne: (filter) => {
        for (const u of inMemoryDb.users.values()) {
            let match = true;
            for (const [k, v] of Object.entries(filter)) {
                if (u[k] !== v) match = false;
            }
            if (match) {
                return createQuery({
                    ...u,
                    save: async function () {
                        inMemoryDb.users.set(String(this._id), this);
                        return this;
                    }
                });
            }
        }
        return createQuery(null);
    },
    create: async (doc) => {
        const u = {
            _id: doc._id || `user_${Date.now()}_${Math.random()}`,
            role: "user",
            recentSearchedCities: [],
            ...doc,
        };
        u.save = async function () {
            inMemoryDb.users.set(String(this._id), this);
            return this;
        };
        inMemoryDb.users.set(String(u._id), u);
        return u;
    },
    findByIdAndUpdate: async (id, update) => {
        const u = inMemoryDb.users.get(String(id));
        if (u) {
            Object.assign(u, update);
            inMemoryDb.users.set(String(id), u);
            return u;
        }
        return null;
    }
});

export const createMockHotelModel = () => ({
    findOne: (filter) => {
        for (const h of inMemoryDb.hotels.values()) {
            let match = true;
            for (const [k, v] of Object.entries(filter)) {
                if (h[k] !== v) match = false;
            }
            if (match) {
                return createQuery({
                    ...h,
                    save: async function () {
                        inMemoryDb.hotels.set(String(this._id), this);
                        return this;
                    }
                });
            }
        }
        return createQuery(null);
    },
    findById: (id) => {
        const h = inMemoryDb.hotels.get(String(id));
        if (!h) return createQuery(null);
        return createQuery({
            ...h,
            save: async function () {
                inMemoryDb.hotels.set(String(this._id), this);
                return this;
            }
        });
    },
    create: async (doc) => {
        const h = {
            _id: doc._id || `hotel_${Date.now()}_${Math.random()}`,
            ...doc,
        };
        h.save = async function () {
            inMemoryDb.hotels.set(String(this._id), this);
            return this;
        };
        inMemoryDb.hotels.set(String(h._id), h);
        return h;
    }
});

export const createMockRoomModel = () => ({
    findById: (id) => {
        const r = inMemoryDb.rooms.get(String(id));
        if (!r) return createQuery(null);
        const hotel = inMemoryDb.hotels.get(String(r.hotel)) || { _id: r.hotel, name: "Mock Hotel" };
        const copy = {
            ...r,
            hotel,
            save: async function () {
                inMemoryDb.rooms.set(String(this._id), this);
                return this;
            }
        };
        return createQuery(copy);
    },
    find: (filter = {}) => {
        const results = [];
        for (const r of inMemoryDb.rooms.values()) {
            let match = true;
            if (filter.isAvailable !== undefined && r.isAvailable !== filter.isAvailable) match = false;
            if (filter.hotel !== undefined && String(r.hotel) !== String(filter.hotel)) match = false;
            if (match) {
                const hotel = inMemoryDb.hotels.get(String(r.hotel)) || { _id: r.hotel, name: "Mock Hotel" };
                results.push({
                    ...r,
                    hotel,
                    save: async function () {
                        inMemoryDb.rooms.set(String(this._id), this);
                        return this;
                    }
                });
            }
        }
        return createQuery(results);
    },
    create: async (doc) => {
        const r = {
            _id: doc._id || `room_${Date.now()}_${Math.random()}`,
            isAvailable: true,
            ...doc,
        };
        r.save = async function () {
            inMemoryDb.rooms.set(String(this._id), this);
            return this;
        };
        inMemoryDb.rooms.set(String(r._id), r);
        return r;
    }
});

export const createMockBookingModel = () => ({
    find: (filter = {}) => {
        const results = [];
        for (const b of inMemoryDb.bookings.values()) {
            let match = true;
            if (filter.user && String(b.user) !== String(filter.user)) match = false;
            if (filter.hotel && String(b.hotel) !== String(filter.hotel)) match = false;
            if (filter.room && String(b.room) !== String(filter.room)) match = false;
            
            // Check-in / check-out overlap comparison
            if (filter.checkInDate && filter.checkInDate.$lte && new Date(b.checkInDate) > new Date(filter.checkInDate.$lte)) {
                match = false;
            }
            if (filter.checkOutDate && filter.checkOutDate.$gte && new Date(b.checkOutDate) < new Date(filter.checkOutDate.$gte)) {
                match = false;
            }

            if (match) {
                results.push({
                    ...b,
                    save: async function () {
                        inMemoryDb.bookings.set(String(this._id), this);
                        return this;
                    }
                });
            }
        }
        return createQuery(results);
    },
    findById: (id) => {
        const b = inMemoryDb.bookings.get(String(id));
        if (!b) return createQuery(null);
        const user = inMemoryDb.users.get(String(b.user)) || { _id: b.user, username: "Guest", email: "guest@example.com" };
        const hotel = inMemoryDb.hotels.get(String(b.hotel)) || { _id: b.hotel, name: "Grand Hotel", address: "123 Main St" };
        const copy = {
            ...b,
            user,
            hotel,
            save: async function () {
                inMemoryDb.bookings.set(String(this._id), this);
                return this;
            }
        };
        return createQuery(copy);
    },
    create: async (doc) => {
        const b = {
            _id: doc._id || `booking_${Date.now()}_${Math.random()}`,
            status: "pending",
            isPaid: false,
            paymentMethod: "Pay at Hotel",
            ...doc,
        };
        b.save = async function () {
            inMemoryDb.bookings.set(String(this._id), this);
            return this;
        };
        inMemoryDb.bookings.set(String(b._id), b);
        return b;
    }
});

