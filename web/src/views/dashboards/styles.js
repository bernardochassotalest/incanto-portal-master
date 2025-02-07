import styled, { css } from 'styled-components';
import { gray, red, white, lightGray, quinary, symbol, senary, accent, secondary } from '~/components/mixins/color';
import { IconButton } from '~/components/crud/styles';

const statusColor = {
  'open': '#f9c0c0',
  'concilied': '#f6f9a6',
  'closed': '#ccf6c8',
  'future': '#f0f0f0'
};

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  padding: 10px;
  span {
    margin: 0 0 10px;
  }
`;

export const ConciliationFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
  padding: 10px;
`;

export const ConciliationFilterButton = styled.button`
  color: #555;
  border: 1px solid ${secondary.hex()};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 14px;
  height: 40px;
  font-weight: bold;
  font-size: 15px;
  min-width: 100px;
  transition: background 0.2s;
  background: ${secondary.hex()};

  &:hover:enabled {
    opacity: 0.75;
  }

  &.active {
    color: white;
    background: ${accent.hex()};
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  padding: 10px;

  h2 {
    font-size: 18px;
    color: ${symbol.hex()};
    padding: 20px 10px;
    margin: 0;
    text-align: center;
    border-bottom: 1px solid #d0d0d0;
  }
  .card-box {
    border: 1px solid #d0d0d0;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    background: white;

    .cards {
      display: flex;
      flex-direction: row;
      flex: 1;
      width: 100%;
    }
  }
  .divider {
    width: 3px;
    margin-top: 33px;
    margin-bottom: 10px;
    background: #d0d0d0;
    height: calc(100% - 33px);
  }
  .left {
    display: flex;
    flex: 1;
    width: 100%;
    padding: 5px;
    gap: 10px;
    height: calc(100vh - 80px);
    overflow: hidden;
    position: relative;
  }
  .right {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    flex: 0 0 35%;
    background: #fff;
    margin-left: 10px;
    border-radius: 3px;
    opacity: 0;
    transition: opacity 1s ease-out;
  }
  ${(props) => props.showForm && css`
    .right {
      opacity: 1;
    }
    @media (max-width: 1024px) {
      .left {
        display: none;
        visibility: hidden;
      }
      .right {
        flex: 1;
        margin-left: 0px;
      }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .right {
        flex: 0 0 45%;
      }
    }
  `}
`;

export const FormHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  height: 56px;
  padding: 0 15px;
  color: ${lightGray.hex()};
  border-bottom: 1px solid ${quinary.hex()};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  padding: 0px;
  height: calc(100% - 120px);
`;

export const FormToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  height: 56px;
  border-top: 1px solid ${quinary.hex()};
  padding: 10px;

  .buttons {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
  }
`;

const ds = '50';
const dhs = '25';
const ofs = '40';

export const CalendarPanel = styled.div`
  border: 1px solid #d0d0d0;
  border-radius: 10px;
  background: ${white.hex()};
  display: flex;
  flex-direction: column;
  width: calc((7 * ${ds}px) + ${ofs}px);
  height: auto;

  h3 {
    font-size: 18px;
    color: #808080;
    border-bottom: 3px solid #f0f0f0;
    padding: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const Week = styled.div`
  display: flex;
  flex-direction: row;
  width: calc((7 * ${ds}px) + ${ofs}px);
  height: calc(${(props) => props.header ? dhs : ds}px + 1px);
  margin: ${(props) => props.header ? '5px 0 5px 0' : '2px 0'};

  ${(props) => props.header && css`
    border-bottom: 1px solid #f0f0f0;
  `}
`;

export const Month = styled.div`
  padding: 0 5px;
`;

export const Day = styled.div`
  display: flex;
  padding: 10px;
  margin: 0 2px;
  width: ${ds}px;
  min-width: ${ds}px;
  cursor: ${(props) => props.status ? 'pointer' : 'default'};;
  height: ${(props) => props.header ? `${dhs}px` : `${ds}px`};
  font-size: 16px;
  justify-content: center;
  align-items: center;
  border-radius: 20%;
  text-decoration: ${(props) => props.today ? 'underline' : 'none'};
  background: ${(props) => statusColor[props.status] || 'transparent'};
  font-weight: ${(props) => (props.today || props.isHoliday || [6, 7].includes(props.weekDay)) ? 'bold' : 'normal'};
  color: ${(props) => props.isHoliday ? red.hex() : gray.hex()};
  position: relative;

  &:hover {
    background: ${(props) => `${statusColor[props.status]}CC` || 'transparent'};
  }

  span {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 12px;
    color: green;
    svg {
      stroke-width: 2;
    }
  }
`;

export const Infos = styled.div`
  border-top: 3px solid #f0f0f0;
  display: flex;
  padding: 10px;
  justify-content: space-between;
  margin-top: 5px;
  width: calc((7 * ${ds}px) + ${ofs}px);

  div {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
  }
  span {
    font-size: 12px;
    height: 15px;
    display: flex;
    align-items: center;
  }
  span:before {
    content: "";
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 5px;
    border-radius: 2px;
  }
  .open:before {
    background: #f9c0c0;
  }
  .concilied:before {
    background: #f6f9a6;
  }
  .closed:before {
    background: #ccf6c8;
  }
  .future:before {
    background: ${senary.hex()};
  }
`;


export const SubInfo = styled.div`
  border-top: 3px solid #f0f0f0;
  display: flex;
  padding: 10px;
  justify-content: space-between;
  margin-top: 5px;
  width: calc((7 * ${ds}px) + ${ofs}px);
  font-size: 12px;
  height: 40px;

  div {
    display: flex;
    align-items: center;
  }

  span {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: green;
    margin-right: 5px;
    svg {
      stroke-width: 2;
    }
  }
`;

export const Cards = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 166px);
  h3 {
    font-size: 18px;
    color: #808080;
    border-bottom: 3px solid #f0f0f0;
    text-align: center;
    padding: 5px;
  }
  .contents {
    position: relative;
    display: flex;
    flex: 0 0 calc(100% - 35px);
    flex-direction: column;
    margin-top: ${(props) => props.hasBtn ? '10px': '0px'};
    width: 100%;
    gap: 23px;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 10px;
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  height: auto;
  border-radius: 2px;
  background: ${white.hex()};

  .odd {
    background: #fafafa;
  }
  h3 {
    font-size: 15px;
    padding: 5px;
    border-bottom: 3px solid ${senary.hex()};
    color: ${lightGray.hex()};
    text-align: left;
  }
  table {
    border-spacing: 0;
    .name {
      font-size: 12px;
      font-weight: normal;
      text-align: left;
    }
    .count {
      font-size: 12px;
      font-weight: bold;
      text-align: right;
      width: 10%;
    }
    .value {
      font-size: 12px;
      font-weight: bold;
      text-align: right;
      width: 30%;
    }
    .link {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    td {
      padding: 5px;
      vertical-align: middle;
    }
    tr.total {
      background: #eaeaea;
    }
    td.total {
      font-weight: bold;
      font-size: 14px;
      padding: 10px 5px;
    }
  }
`;

export const ColapseBtn = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  font-size: 24px;
  color: ${lightGray.hex()};
  top: 24px;
  left: 20px;
  cursor: pointer;
`;

export const ConciliationButton = styled(IconButton)`
  position: absolute;
  top: -5px;
  right: 10px;
  width: 30px;
  height: 30px;
  font-size: 22px;
`;

export const CardIconButton = styled(IconButton)`
  position: absolute;
  top: -5px;
  right: 10px;
  width: 30px;
  height: 30px;
  font-size: 22px;
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  height: calc(100% - 50px);

  .primary {
    display: flex;
    align-items: center;
    justify-content: center;
    ${(props) => !props.isEmpty && css`
      flex: 0 0 calc(100vh - 480px);
      height: calc(100vh - 480px);
    `}
    ${(props) => props.isEmpty && css`
      flex: 1;
      height: 100%;
    `}
  }
  .secondary {
    display: flex;
    flex: 0 0 160px;
    height: 143px;
    align-items: center;
    justify-content: center;
    fieldset {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .invoiced-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100%);
    width: 100%;
  }
  .bills-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: hidden;
    height: 100%;
    width: 100%;
  }
  h3 {
    color: ${gray.fade(0.6).string()};
    font-size: 22px;
  }
`;

export const ChartContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(100%);
  gap: 3px;
  padding: 1px 0px;
  background: #d0d0d0;
`;

export const ChartBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  height: calc(100%);
  background: ${white.hex()};

  h3 {
    font-size: 18px;
    color: #808080;
    border-bottom: 3px solid #f0f0f0;
    padding: 5px;
    padding-left: 10px;
    text-align: center;
    background: ${white.hex()};
  }
  .chart {
    height: 202px;
    border-bottom: 1px solid #f0f0f0;
    background: ${white.hex()};
  }
  .table {
    height: calc(100% - 170px);
  }
`;

export const ConciliationPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 191px);

  fieldset {
    height: 100%;
  }

  .transactions {
    display: flex;
    flex-direction: column;
    flex: 0 0 calc(100% - 248px);
  }
  .selection {
    display: flex;
    flex-direction: column;
    flex: 0 0 248px;
    fieldset {
      height: calc(100% - 80px);
    }
    &>div {
      height: 60px;
    }
  }
  ${(props) => props.previewMode && css`
    .transactions {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;

      .primary {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 100%;
      }
    }
  `}
`;
