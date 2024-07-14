// import React, { useState, useContext, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import axios from 'axios';
// import { UserContext } from '../../context/LoginContext';

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   height: 100vh; 
//   text-align: center;
// `;

// const FormContainer = styled.div`
//   width: 80%;
//   max-width: 500px;
//   background-color: white;
//   padding: 20px;
//   border-radius: 10px;
//   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 10px;
//   margin: 10px 0;
//   border: 1px solid #ddd;
//   border-radius: 5px;
// `;

// const Button = styled.button`
//   background: #a3d2ca;
//   border: none;
//   padding: 10px 20px;
//   cursor: pointer;
//   margin-top: 10px;
// `;

// const EditTrain = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { date, exerciseLogId } = location.state || {};
//   const { accessToken, userId } = useContext(UserContext);

//   const [formData, setFormData] = useState({
//     exerciseLogId: exerciseLogId,
//     exerciseName: '',
//     set: '',
//     exerciseType: '',
//     distance: '',
//     exerciseTime: ''
//   });

//   useEffect(() => {
//     if (exercise) {
//       setFormData({
//         exerciseLogId: exercise.id,
//         exerciseName: exercise.name.split(' - ')[0],
//         set: exercise.name.split(' - ')[1].replace('세트', ''),
//         exerciseType: exercise.exerciseType || '',
//         distance: exercise.distance || '',
//         exerciseTime: exercise.exerciseTime || ''
//       });
//     }
//   }, [exercise]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put('http://localhost:4000/exerciseLog', formData, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       });

//       if (response.status === 200) {
//         alert('운동 기록이 수정되었습니다.');
//         navigate('/dailytraining', { state: { date: exercise.date } });
//       } else {
//         alert('운동 기록 수정에 실패했습니다.');
//       }
//     } catch (error) {
//       console.error('Error updating exercise:', error);
//       alert('운동 기록 수정 중 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <Container>
//       <h3>운동 기록 수정</h3>
//       <FormContainer>
//         <form onSubmit={handleSubmit}>
//           <Input
//             type="text"
//             name="exerciseName"
//             value={formData.exerciseName}
//             onChange={handleChange}
//             placeholder="운동 이름"
//           />
//           <Input
//             type="number"
//             name="set"
//             value={formData.set}
//             onChange={handleChange}
//             placeholder="세트 수"
//           />
//           <Input
//             type="text"
//             name="exerciseType"
//             value={formData.exerciseType}
//             onChange={handleChange}
//             placeholder="운동 종류"
//           />
//           <Input
//             type="number"
//             name="distance"
//             value={formData.distance}
//             onChange={handleChange}
//             placeholder="거리 (km)"
//           />
//           <Input
//             type="text"
//             name="exerciseTime"
//             value={formData.exerciseTime}
//             onChange={handleChange}
//             placeholder="운동 시간 (hh:mm:ss)"
//           />
//           <Button type="submit">수정 완료</Button>
//         </form>
//       </FormContainer>
//     </Container>
//   );
// };

// export default EditTrain;
