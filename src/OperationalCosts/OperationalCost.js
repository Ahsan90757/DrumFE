import { useNavigate } from 'react-router-dom';

function OperationalCost() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Operational Costs Dashboard</h2>

      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/todays-operational-cost')}>
        Today's Operational Costs
      </p>

      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/add-category')}>
        Add a New Category
      </p>

      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/edit-category')}>
        Edit Category
      </p>

    </div>
  );
}

export default OperationalCost;
