import ConsciousRobotLogo from "./ConsciousRobotLogo.tsx";

export default function Header () {
  return (
    <div class="flex flex-row justify-start my-10 p-4 mx-auto max-w-screen-lg">
      <div class="flex items-center flex-1">
        <div class="max-w-[200px]">
          <ConsciousRobotLogo />
        </div>
      </div>
    </div>
  );
}
