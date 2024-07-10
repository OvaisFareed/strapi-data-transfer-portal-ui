export default function Home() {
  const form = [
    {
      label: 'From (source strapi instance)',
      type: 'text',
      placeholder: 'Enter source strapi url',
    }
  ];

  const setValue = (value, label) => {
    console.log(value, label);
  }

  return (
    <>
      {form.map(input => {
        return (
          <div>
            <label className="mr-2">{input.label}</label>
            <input
              className="w-[300px]"
              type={input.type}
              placeholder={input.placeholder}
              value={""}
              onChange={(e) =>
                setValue(e.target.value, input.label)
              }
            />
          </div>
        )
      })}

    </>
  );
}
