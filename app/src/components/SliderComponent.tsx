import React from "react";
import ReactSlider from "react-slider";

interface SliderComponentProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  chainName: string;
}

const SliderComponent: React.FC<SliderComponentProps> = ({ value, max, onChange, chainName }) => {
  return (
    <div className="slider-container">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{chainName}</label>
        <span className="text-sm text-gray-500">Max: {max.toFixed(4)} ETH</span>
      </div>
      
      <ReactSlider
        className="horizontal-slider"
        thumbClassName="slider-thumb"
        trackClassName="slider-track"
        value={value}
        max={max}
        min={0}
        step={0.0001}
        onChange={onChange}
        renderThumb={(props, state) => (
          <div {...props} className="slider-thumb">
            <div className="thumb-label">
              {state.valueNow.toFixed(4)}
            </div>
          </div>
        )}
      />
      
      <div className="mt-2">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = Math.min(parseFloat(e.target.value) || 0, max);
            onChange(newValue);
          }}
          max={max}
          min={0}
          step={0.0001}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="0.0000"
        />
      </div>
    </div>
  );
};

export default SliderComponent;