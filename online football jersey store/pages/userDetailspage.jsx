import data from "../data/data.json";

function UserDetailPage(){
    const users = data.users;

    return (
        <div>
            <h1>User List</h1>

            {users.map((user) => (
                <div key={user.id}>+
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p>{user.role}</p>
                </div>
            ))}
        </div>
    );
}

export default userDetailPage;