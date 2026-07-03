import { useState, useEffect } from 'react';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../../services/api';

function AdminTeams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        country_code: '',
        flag: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const response = await getTeams();
            if (response.data.success) {
                setTeams(response.data.teams);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            if (editingTeam) {
                await updateTeam(editingTeam.id, formData);
                setMessage('✅ Team updated successfully!');
            } else {
                await createTeam(formData);
                setMessage('✅ Team created successfully!');
            }
            setTimeout(() => setMessage(''), 3000);
            resetForm();
            fetchTeams();
        } catch (error) {
            setMessage('❌ Error: ' + (error.response?.data?.message || 'Something went wrong'));
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', country_code: '', flag: '' });
        setEditingTeam(null);
        setShowForm(false);
    };

    const handleEdit = (team) => {
        setEditingTeam(team);
        setFormData({
            name: team.name,
            country_code: team.country_code || '',
            flag: team.flag || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this team?')) {
            try {
                await deleteTeam(id);
                setMessage('✅ Team deleted!');
                setTimeout(() => setMessage(''), 3000);
                fetchTeams();
            } catch (error) {
                setMessage('❌ Error deleting team');
                setTimeout(() => setMessage(''), 3000);
            }
        }
    };

    if (loading) return <div className="loading">Loading teams...</div>;

    return (
        <div className="admin-teams">
            <div className="admin-header">
                <h1>🏆 Manage Teams</h1>
                <button className="add-btn" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Close' : '+ Add New Team'}
                </button>
            </div>

            {message && (
                <div className={`admin-message ${message.includes('✅') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {showForm && (
                <form className="admin-form" onSubmit={handleSubmit}>
                    <h3>{editingTeam ? '✏️ Edit Team' : '➕ Add New Team'}</h3>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Team Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Australia"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Country Code</label>
                            <input
                                type="text"
                                name="country_code"
                                value={formData.country_code}
                                onChange={handleChange}
                                placeholder="e.g., AU"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Flag Emoji</label>
                        <input
                            type="text"
                            name="flag"
                            value={formData.flag}
                            onChange={handleChange}
                            placeholder="e.g., 🇦🇺"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            {editingTeam ? 'Update Team' : 'Add Team'}
                        </button>
                        <button type="button" className="cancel-btn" onClick={resetForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="teams-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Flag</th>
                            <th>Team Name</th>
                            <th>Country Code</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map(team => (
                            <tr key={team.id}>
                                <td>{team.id}</td>
                                <td style={{ fontSize: '1.5rem' }}>{team.flag || '🏳️'}</td>
                                <td>{team.name}</td>
                                <td>{team.country_code || '-'}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(team)}>✏️</button>
                                    <button className="delete-btn" onClick={() => handleDelete(team.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminTeams;